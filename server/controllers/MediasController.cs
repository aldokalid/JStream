using apijstream.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace apijstream.controllers;

[ApiController]
[Route("api/[controller]")]
public class MediasController : ControllerBase
{
  private readonly IMedia _repo;

  public MediasController(IMedia iMedia)
  {
    _repo = iMedia;
  }

  /// <summary>
  /// Obtiene el catálogo entero.
  /// </summary>
  /// <returns></returns>
  [HttpGet]
  public async Task<IActionResult> GetAllAsync() => Ok(await _repo.GetAllAsync());

  [HttpGet("id/{id}")]
  public async Task<IActionResult> GetAsync(int id)
  {
    // Se usa IActionResult para regresar una respuesta HTTP de la que se desconoce su contenido.
    var res = await _repo.GetByIdAsync(id);

    return res == null ? NotFound($">ERR:NOT_FOUND; media with id {id} not found") : Ok(res);
  }

  /// <summary>
  /// Obtiene el catálogo que coincide con el título entregado.
  /// </summary>
  /// <param name="title">El título de búsqueda.</param>
  /// <returns></returns>
  [HttpGet("title/{title}")]
  public async Task<IActionResult> GetByTitleAsync(string title)
  {
    if (title == null)
      return await GetAllAsync();

    var res = await _repo.GetByTitle(title);

    return res == null ? NotFound($">ERR:NOT_FOUND; no media titles found with {title}") : Ok(res);
  }

  /// <summary>
  /// Busca el catálogo por género.
  /// </summary>
  /// <param name="genre">Número que representa el género.</param>
  /// <returns></returns>
  [HttpGet("genre/{genre}")]
  public async Task<IActionResult> GetByGenre(int? genre)
  {
    return Ok(await _repo.GetByGenreAsync(genre));
  }

  // Regresa una consulta después de la creación.
  // Creación: return CreatedAtAction(nameof(funcName), new {id = c.id}, c);
}