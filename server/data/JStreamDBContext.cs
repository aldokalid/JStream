using apijstream.environments;
using apijstream.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace apijstream.Data;

public class JStreamDBContext : DbContext
{
  public JStreamDBContext(DbContextOptions<JStreamDBContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
  public DbSet<Media> Medias => Set<Media>();
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

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder.UseSqlServer(JStreamEnvironment.DB_STRING);
  }
}