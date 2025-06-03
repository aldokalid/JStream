using System.Text;
using apijstream.data;
using apijstream.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using apijstream.interfaces;
using apijstream.repositories;

var builder = WebApplication.CreateBuilder(args);

// Obtiene la llave de Jwt.
var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtKey"]!);

// Origen permitido en Cors.
var corsAllowedOrigin = builder.Configuration["Cors:AllowedOrigin"]
  ?? "http://localhost:4200";

// Inyecta la llave.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    // Manejo de tokens.
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = false, // Validar emisor (false: yo mismo).
      ValidateAudience = false, // Validar quién lo recibe (no necesario si se consume por varios clientes).
      ValidateIssuerSigningKey = true, // Validar que la llave sea la correcta.
      IssuerSigningKey = new SymmetricSecurityKey(key) // Llave para cifrar.
    };
  });

// builder.Services.AddScoped(UserService);

builder.Services.AddCors(options =>
{
  options.AddPolicy("FrontendPolicy", policy =>
  {
    policy.WithOrigins(corsAllowedOrigin)
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
  });
});
// Contexto DbContext.
builder.Services.AddDbContext<JStreamDbContext>(options =>
{
  options.UseSqlServer(builder.Configuration.GetConnectionString("db")!);
});

// ** Dependencias **
builder.Services.AddScoped<IMedia, MediaRepository>(); // Inyecta la dependencia de Media.
builder.Services.AddScoped<IEntity<User, string>, UserRepository>(); // Inyecta la dependencia de User.
builder.Services.AddSingleton<UserService>(); // Uno para todo el programa porque gestiona tokens.

// ** Controladores **
builder.Services.AddControllers();

// ** Swagger **
// Todas las rutas de una petición.
builder.Services.AddEndpointsApiExplorer();
// Generación de Swagger.
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo
  {
    Title = "JStream API",
    Version = "V1"
  });
});

// *-*-*-*-*
var app = builder.Build();

// ** Middleware: Entre frontend y backend **
// HTTPS redirection.
app.UseHttpsRedirection();
// Cors. Debe ponerse antes de las siguientes dos líneas, si no, cors bloqueará las solicitudes.
app.UseCors("FrontendPolicy");
// Para JWT.
app.UseAuthentication(); // Primero verifica si el usuario tiene un token válido.
app.UseAuthorization(); // Después de lo anterior, decide si el usuario tiene permiso de acceder.
// Controles de Swagger.
app.MapControllers();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.Run();
