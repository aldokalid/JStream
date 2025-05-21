using System.Text.Json;
using apijstream.Data;
using apijstream.models;
using Microsoft.EntityFrameworkCore;

// Almacena las sesiones abiertas (nombres de usuario). @deprecated método inseguro
List<string> openedSessions = [];

var builder = WebApplication.CreateBuilder(args);

// @deprecated Esto permite cualquier conexión al backend.
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll",
      policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Contexto DbContext.
builder.Services.AddDbContext<JStreamDBContext>();

var app = builder.Build();
// Cors.
app.UseCors("AllowAll");

app.UseHttpsRedirection();

// Endpoint session.
app.MapPost("/session", async (HttpRequest req) =>
{
  using var json = await JsonDocument.ParseAsync(req.Body);
  var root = json.RootElement;
  string? username = root.GetProperty("username").GetString();

  if (username == null)
    throw new Exception(">ERR:PARAM_MISSING; username, password or both missing");
  else if (openedSessions.Find(oS => oS == username) == null)
    return Results.Ok(false);
  else
    return Results.Ok(true);
})
.WithName("session");

// Endpoint login.
app.MapPost("/login", async (HttpRequest req, JStreamDBContext dBContext) =>
{
  try
  {
    using var json = await JsonDocument.ParseAsync(req.Body);
    var root = json.RootElement;
    string? username = root.GetProperty("username").GetString();
    string? password = root.GetProperty("password").GetString();

    if (username == null || password == null)
      throw new Exception(">ERR:PARAM_MISSING; username, password or both missing");

    await dBContext.Database.ExecuteSqlAsync($"EXEC sign_in {username}, {password}");

    if (openedSessions.FindIndex(oS => oS == username) == -1)
      openedSessions.Add(username);

    return Results.Ok(username);
  }
  catch (Exception err)
  {
    return Results.BadRequest(err.Message);
  }
}
)
.WithName("login");

// Endpoint logout.
app.MapPost("/logout", async (HttpRequest req) =>
{
  using var json = await JsonDocument.ParseAsync(req.Body);
  var root = json.RootElement;
  string? username = root.GetProperty("username").GetString();

  int auxIdx = openedSessions.FindIndex(oS => oS == username);

  if (auxIdx != -1)
    openedSessions.RemoveAt(auxIdx);

  return Results.Ok();
}
)
.WithName("logout");

// Endpoint signup.
app.MapPost("/signup", async (HttpRequest req, JStreamDBContext dBContext) =>
{
  try
  {
    using var json = await JsonDocument.ParseAsync(req.Body);
    var root = json.RootElement;
    string? username = root.GetProperty("username").GetString();
    string? password = root.GetProperty("password").GetString();

    if (username == null || password == null)
      throw new Exception(">ERR:PARAM_MISSING; username, password or both missing");

    await dBContext.Database.ExecuteSqlAsync($"EXEC sign_up {username}, {password}");

    return Results.Ok();
  }
  catch (Exception err)
  {
    return Results.BadRequest(err.Message);
  }
}
)
.WithName("signup");

// Endpoint de un elemento del catálogo.
app.MapGet("/get_media/{id}", async (int? id, JStreamDBContext dbContext) =>
{
  try
  {
    if (id == null)
      throw new Exception(">ERR:PARAM_MISSING; id must be defined");

    List<Media> medias = await dbContext.Medias.ToListAsync();

    int mediaIdx = medias.FindIndex(m => m.idmedia == id);

    return mediaIdx == -1
      ? throw new Exception($">ERR:NOT_FOUND; media with id {id} not found")
      : Results.Ok(medias[mediaIdx]);
  }
  catch (Exception err)
  {
    return Results.BadRequest(err.Message);
  }
});

// Endpont del catálogo completo.
app.MapGet("/get_medias", async (JStreamDBContext dbContext) =>
{
  try
  {
    var medias = await dbContext.Medias.ToListAsync();
    return Results.Ok(medias);
  }
  catch (Exception err)
  {
    return Results.BadRequest(err.Message);
  }
})
.WithName("GetMedias");

// Endpoint del catálogo por títulos.
app.MapGet("/find_medias_by_title/{title}", async (string? title, JStreamDBContext dbContext) =>
{
  try
  {
    if (title == null || title == "")
      return Results.Ok(new List<Media>());

    // Busca contenido por título.
    var medias = (await dbContext.Medias.ToListAsync())
      .FindAll(m => m.title?.Contains(title, StringComparison.CurrentCultureIgnoreCase) ?? false);

    return Results.Ok(medias);
  }
  catch (Exception err)
  {
    return Results.BadRequest(err.Message);
  }
});

// Endpoint del catálogo por géneros.
app.MapGet("/find_medias_by_genre/{genre}", async (byte? genre, JStreamDBContext dbContext) =>
{
  try
  {
    if (genre < 0 || genre > 5)
      throw new Exception(">ERR:PARAM_INVALID; given genre is invalid (0 <= genre <= 5)");
    if (genre == 0)
      return Results.Ok(await dbContext.Medias.ToListAsync());

    return Results.Ok((await dbContext.Medias.ToListAsync()).FindAll(m => m.genre == genre));
  }
  catch (Exception err)
  {
    return Results.BadRequest(err.Message);
  }
});

app.Run();
