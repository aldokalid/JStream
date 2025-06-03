using apijstream.models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace apijstream.data;

public class UserService
{
  public class UserToken
  {
    /// <summary>El nombre del usuario que solicitó el token.</summary>
    public string Username { get; set; } = "";
    /// <summary> El token generado. </summary>
    public string Token { get; set; } = "";
    /// <summary> Fecha de expiración a largo plazo.</summary>
    public DateTime LongTermExpiration { get; set; }
  }

  private readonly string _connection;
  private readonly IServiceProvider _dbProvider;

  /// <summary>Tokens de sesión activos</summary>
  private List<UserToken> _jwtTokens = [];

  public UserService(IConfiguration config, IServiceProvider dbProvider)
  {
    _connection = config.GetConnectionString("db")!;
    _dbProvider = dbProvider;
  }

  /// <summary>
  /// Inicia sesión para un usuario.
  /// </summary>
  /// <param name="username">Nombre del usuario.</param>
  /// <param name="password">Contraseña del usuario.</param>
  /// <returns></returns>
  public async Task<bool> SignIn(string username, string password)
  {

    using var conn = new SqlConnection(_connection);

    await conn.OpenAsync(); // Abre una sesión de la base de datos.

    var sqlQuery = new SqlCommand($"EXEC sign_in {username}, {password}", conn);

    try
    {
      await sqlQuery.ExecuteNonQueryAsync();
      return true;
    }
    catch (SqlException err) when (err.Number == 2627)
    {
      return false;
    }
    catch (Exception err)
    {
      throw new ArgumentException(err.Message);
    }
  }

  /// <summary>
  /// Obtiene las credenciales de un usuario mediante un token registrado.
  /// </summary>
  /// <param name="token">El token de la sesión requerida.</param>
  /// <returns></returns>
  /// <exception cref="ArgumentNullException">Cuando el token requerido es nulo.</exception>
  /// <exception cref="KeyNotFoundException">Cuando no se encuentra el token requerido.</exception>
  /// <exception cref="SecurityTokenExpiredException">Cuando el token requerido ha expirado.</exception>
  public async Task<User?> SignInWithTokenAsync(string? token)
  {
    if (token is null)
      throw new ArgumentNullException(nameof(token), ">ERR:PARAM_MISSING; token is missing");

    int tokenIdx = _jwtTokens.FindIndex(t => t.Token == token);

    if (tokenIdx == -1)
      throw new KeyNotFoundException(">ERR:TOKEN_NOT_FOUND; given token is not registered");
    else if (_jwtTokens[tokenIdx].LongTermExpiration <= DateTime.UtcNow)
    {
      _jwtTokens.RemoveAt(tokenIdx); // Elimina el token del arreglo.
      throw new SecurityTokenExpiredException(">ERR:TOKEN_EXPIRED; given token is expired");
    }

    // Obtiene el servicio de DbContext.
    using var scope = _dbProvider.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<JStreamDbContext>();

    return (await dbContext.Users.ToListAsync()).Find(u => u.username == _jwtTokens[tokenIdx].Username);
  }

  /// <summary>
  /// Registra un usuario.
  /// </summary>
  /// <param name="username">El nombre de usuario del nuevo registro.</param>
  /// <param name="password">La contraseña del nuevo registro.</param>
  /// <returns></returns>
  public async Task<bool> SignUp(string username, string password)
  {
    using var connection = new SqlConnection(_connection);

    await connection.OpenAsync(); // Abre una sesión de la base de datos.

    // La contraseña es encriptada en el procedimiento "sign_up".
    using var command = new SqlCommand("sign_up", connection)
    {
      CommandType = System.Data.CommandType.StoredProcedure
    };
    command.Parameters
      .Add(new SqlParameter("@username", System.Data.SqlDbType.VarChar) { Value = username });
    command.Parameters
      .Add(new SqlParameter("@password", System.Data.SqlDbType.NVarChar) { Value = password });

    try
    {
      await command.ExecuteNonQueryAsync();
    }
    catch (SqlException err) when (err.Number == 2627) // Violación UNIQUE.
    {
      throw new ArgumentException($">ERR:UNIQUE_VIOLATION; username '{username}' already taken");
    }
    catch (Exception)
    {
      throw;
    }

    return true;
  }

  /// <summary>
  /// Cierra una sesión y elimina el token relacionado del arreglo de tokens (esto no caduca el token).
  /// </summary>
  /// <param name="token">Token de sesión</param>
  /// <returns>Verdadero cuando el token fue eliminado. Falso cuando el token no se econtró.</returns>
  public bool SignOut(string token)
  {
    int tokenIdx = _jwtTokens.FindIndex(t => t.Token == token);

    if (tokenIdx == -1)
      return false;

    _jwtTokens.RemoveAt(tokenIdx);

    return true;
  }

  /// <summary>
  /// Agrega un nuevo token al arreglo de sesiones, regresando el mismo token dado.
  /// También buscará tokens previamente registrados. Si los encuentra, los eliminará.
  /// </summary>
  /// <param name="username">El nombre del usuario.</param>
  /// <param name="token">El token generado para el usuario.</param>
  /// <returns></returns>
  /// <exception cref="ArgumentNullException">Cuando alguno de los argumentos es nulo.</exception>
  public string AddToken(string username, string token)
  {
    if (username is null)
      throw new ArgumentNullException(nameof(username), ">ERR:PARAM_MISSING; username is missing");
    else if (token is null)
      throw new ArgumentNullException(nameof(token), ">ERR:PARAM_MISSING; token is missing");

    // Busca tokens anteriores.
    int auxIdx = _jwtTokens.FindIndex(t => t.Username == username);

    if (auxIdx != -1) // Elimina el token anterior.
      _jwtTokens.RemoveAt(auxIdx);

    _jwtTokens.Add(new UserToken
    {
      LongTermExpiration = DateTime.UtcNow.AddDays(7),
      Token = token,
      Username = username
    });

    return token;
  }

  /// <summary>
  /// Obtiene un UserToken registrado.
  /// </summary>
  /// <param name="token">El token a buscar.</param>
  /// <returns></returns>
  /// <exception cref="ArgumentNullException">Cuando <paramref name="token"/> es nulo.</exception>
  public UserToken? RetrieveUserToken(string? token)
  {
    if (token is null)
      throw new ArgumentNullException(nameof(token), ">ERR:PARAM_MISSING; token is missing");

    return _jwtTokens.Find(t => t.Token == token);
  }

  /// <summary>
  /// Expira y elimina un token del arreglo.
  /// </summary>
  /// <param name="username">El usuario al cual se le expirará su token.</param>
  /// <returns>Verdadero cuando el token fue expirado y eliminado. Falso en caso contrario.</returns>
  public bool ExpireToken(string username)
  {
    if (username is not null)
    {
      int auxIdx = _jwtTokens.FindIndex(t => t.Username == username);

      if (auxIdx != -1)
      {
        _jwtTokens.RemoveAt(auxIdx);
        return true;
      }
    }

    return false;
  }

  /// <summary>
  /// Checks if a given token is renewable.
  /// </summary>
  /// <param name="token">El token a renovar.</param>
  /// <returns></returns>
  /// <exception cref="ArgumentNullException">Cuando el token es nulo.</exception>
  public bool IsTokenRenewable(string token)
  {
    if (token is null)
      throw new ArgumentNullException(nameof(token), ">ERR:PARAM_MISSING; token is missing");

    int auxIdx = _jwtTokens.FindIndex(t => t.Token == token);

    if (auxIdx != -1 && _jwtTokens[auxIdx].LongTermExpiration > DateTime.UtcNow)
      return true;

    return false;
  }
}