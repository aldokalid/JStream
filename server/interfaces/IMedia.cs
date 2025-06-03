using apijstream.models;

namespace apijstream.interfaces

{
  public interface IMedia : IEntity<Media, int>
  {
    /// <summary>
    /// Obtiene un elemento del catálogo por título.
    /// </summary>
    /// <param name="title">El título para buscar.</param>
    /// <returns></returns>
    Task<IEnumerable<Media>> GetByTitle(string title);

    Task<IEnumerable<Media>> GetByGenreAsync(int? genre);
  }
}