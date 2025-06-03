using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using apijstream.data;
using apijstream.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace apijstream.controllers;

[ApiController]
[Route("api/{controller}")]
public class AuthController : ControllerBase
{
  private readonly UserService _userService;
  private readonly IConfiguration _config;

  public AuthController(UserService userService, IConfiguration config)
  {
    _userService = userService;
    _config = config;
  }

  /// <summary>
  /// Inicia sesión para un usuario.
  /// </summary>
  /// <param name="user">Datos del usuario.</param>
  /// <returns></returns>
  [HttpPost("signin")]
  public async Task<IActionResult> SignInAsync(DTOUser user)
  {
    try
    {
      var signedIn = await _userService.SignIn(user.Username, user.Password);

      if (!signedIn)
        return NotFound(new { message = $">ERR:NOT_FOUND; user '{user.Username}' not found" });

      // Caduca un token anterior (si existe).
      _userService.ExpireToken(user.Username);
      // Genera un nuevo token.
      var token = GenerateToken(user.Username);

      return Ok(new { token });
    }
    catch (Exception err)
    {
      return BadRequest(err);
    }
  }

  /// <summary>
  /// Cierra una sesión y expira el token
  /// </summary>
  /// <returns></returns>
  [Authorize]
  [HttpPost("signout")]
  public IActionResult ExpireToken()
  {
    // Obtiene el token (elimina "Bearer " de la cadena).
    var authToken = Request.Headers.Authorization.FirstOrDefault()?[7..];

    try
    {
      UserService.UserToken? auxToken = _userService.RetrieveUserToken(authToken);

      if (auxToken is not null)
        _userService.ExpireToken(auxToken.Username);

      return Ok(true);
    }
    catch (Exception err)
    {
      return BadRequest(err.Message);
    }
  }

  /// <summary>
  /// Inicia sesión de un usuario, generando un token de sesión.
  /// </summary>
  /// <param name="user"></param>
  /// <returns></returns>
  [HttpPost("signup")]
  public async Task<IActionResult> SignUpAsync(DTOUser user)
  {
    try
    {
      var signedUp = await _userService.SignUp(user.Username, user.Password);

      if (!signedUp)
        return Conflict(new { message = $">ERR:UNIQUE_VIOLATION; username {user.Username} already taken" });

      var token = GenerateToken(user.Username);

      return Ok(new { token });
    }
    catch (ArgumentException err)
    {
      return BadRequest(err.Message);
    }
    catch (Exception err)
    {
      return StatusCode(500, err);
    }
  }

  /// <summary>
  /// Obtiene la información de una sesión mediante el token de sesión.
  /// </summary>
  /// <returns></returns>
  [Authorize]
  [HttpGet("data")]
  public async Task<IActionResult> GetUserData()
  {
    // Obtiene el token (elimina "Bearer " de la cadena).
    var authToken = Request.Headers.Authorization.FirstOrDefault()?[7..];

    try
    {
      return Ok(await _userService.SignInWithTokenAsync(authToken));
    }
    catch (Exception err)
    {
      return BadRequest(err.Message);
    }
  }

  /// <summary>
  /// Solicita un nuevo token.
  /// </summary>
  /// <param name="token">El token anterior</param>
  /// <returns></returns>
  [HttpGet("new_token/{token}")]
  public async Task<IActionResult> RequestNewToken(string token)
  {
    try
    {
      if (!_userService.IsTokenRenewable(token))
        return Unauthorized();

      User? u = await _userService.SignInWithTokenAsync(token)
        ?? throw new NullReferenceException(">ERR:NOT_FOUND; given token not foudn");

      string newToken = GenerateToken(u.username);

      return Ok(new { token = newToken, u.username });
    }
    catch (Exception err)
    {
      return BadRequest(err.Message);
    }
  }

  /// <summary>
  /// Genera un Token de JWT.
  /// </summary>
  /// <param name="username">El nombre de usuario.</param>
  /// <returns></returns>
  private string GenerateToken(string username)
  {
    var key = Encoding.ASCII.GetBytes(_config["JwtKey"]!);

    // El claim asocia un token a un nombre se usuario.
    var claims = new[] {
      new Claim(ClaimTypes.NameIdentifier, username)
    };

    // Credenciales (firma secreta para hacer válido el token de sesión).
    var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

    // Parámetros para el token.
    var jwt = new JwtSecurityToken(
      claims: claims,
      expires: DateTime.UtcNow.AddHours(2),
      signingCredentials: credentials
    );

    // Genera, registra y regresa el token.
    return _userService.AddToken(username, new JwtSecurityTokenHandler().WriteToken(jwt));
  }
}

/// <summary>
/// DTO para la clase User.
/// </summary>
public class DTOUser
{
  public string Username { get; set; } = "";
  public string Password { get; set; } = "";
}