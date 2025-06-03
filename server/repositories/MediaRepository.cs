using apijstream.data;
using apijstream.interfaces;
using apijstream.models;
using Microsoft.EntityFrameworkCore;

namespace apijstream.repositories;

public class MediaRepository : IMedia
{
  private readonly JStreamDbContext _dbContext; // Inyección de dependencias.

  public MediaRepository(JStreamDbContext dbContext)
  {
    _dbContext = dbContext; // Inyección de dependencias.
  }

  public Task<Media> CreateAsync(Media entity)
  {
    throw new NotImplementedException(">ERR:FORBIDDEN; media creation is forbidden");
  }

  public async Task<IEnumerable<Media>> GetAllAsync()
  {
    return await _dbContext.Medias.ToListAsync();
  }

  public async Task<IEnumerable<Media>> GetByGenreAsync(int? genre)
  {
    if (genre is null || genre <= 0)
      return await GetAllAsync();

    return (await _dbContext.Medias.ToListAsync()).FindAll(m => m.genre == genre);
  }

  public async Task<Media?> GetByIdAsync(int id)
  {
    return await _dbContext.Medias.FindAsync(id)
     ?? throw new Exception($">ERR:NOT_FOUND; media with id {id} not found");
  }

  public async Task<IEnumerable<Media>> GetByTitle(string title)
  {
    var media = _dbContext.Medias.Where(m => m.title != null && m.title.Contains(title));

    return await media.ToListAsync();
  }

  public Task<bool> RemoveAsync(Media entity)
  {
    throw new NotImplementedException(">ERR:FORBIDDEN; media removal is forbidden");
  }

  public Task<bool> UpdateAsync(Media entity)
  {
    throw new NotImplementedException(">ERR:FORBIDDEN; media update is forbidden");
  }
}
