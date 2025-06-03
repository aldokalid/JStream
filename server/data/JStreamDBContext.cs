using apijstream.environments;
using apijstream.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace apijstream.data;

/// <summary>
/// Clase contexto para la comunicación con la base de datos.
/// </summary>
/// <param name="options">Opciones DbContext</param>
public class JStreamDbContext(DbContextOptions<JStreamDbContext> options) : DbContext(options)
{
  // Esta definición es un getter.
  public DbSet<User> Users => Set<User>();
  public DbSet<Media> Medias => Set<Media>();

  // Se ejecuta cuando el modelo se crea.
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    // Obtiene los modelos.
    EntityTypeBuilder<Media> mediaEntity = modelBuilder.Entity<Media>();
    EntityTypeBuilder<User> userEntity = modelBuilder.Entity<User>();

    // Liga los modelos a las tablas de la base de datos.
    mediaEntity.ToTable("_media");
    userEntity.ToTable("_user");

    // Asigna las llaves primaria.
    mediaEntity.HasKey(mE => mE.idmedia);
    userEntity.HasKey(uE => uE.iduser);
  }

  // Se ejecuta cuando el modelo es configurado.
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    // Esta línea es la conexión con la base de datos. Ö @deprecated Usar ConnectionStrings
    optionsBuilder.UseSqlServer(JStreamEnvironment.DB_STRING);
  }
}