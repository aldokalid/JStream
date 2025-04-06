import DOMRender from "./objects/DOMRender.js";

// Globales.
/** @type {import("./index.js").MovieObject|undefined} */
let movie;
/** @type {string|undefined} */
let currSession = DOMRender.getParam('session');

// ** EVENTOS **
// Imagen de usuario.
document
  .getElementById('user-img')
  .addEventListener('click', e => {
    e.stopPropagation();

    if (!currSession)
      DOMRender.renderLoginPopup(session => currSession = session);
    else {
      try {
        DOMRender.renderSessionPopup();
      } catch (err) {
        DOMRender.disposeSessionPopup();
      }
    }
  });
// Logo.
document
  .getElementById('logo')
  .addEventListener('click', () => {
    const params = currSession
      ? `?session=${currSession}`
      : '';

    window.location.assign(window.location.origin + params)
  });
// Categorías
document
  .getElementById('categories-option')
  .addEventListener('click', () => {
    const params = currSession
      ? `?session=${currSession}`
      : '';

    window.location.assign(window.location.origin + '/categories.html' + params);
  });

// ** FETCH **
fetch('assets/movies.json')
  .then(data => data.json())
  .then(json => {
    const movieId = DOMRender.getParam('movie');

    if (!movieId)
      throw new Error(`Movie with id '${movieId}' not found`);

    movie = json.find(m => `${m.id}` === movieId);

    // Asignar fondo.
    document.getElementById('background-img').src = movie.background;
    // Asignar carátula.
    document.getElementById('cover-img').src = movie.cover;
    // Asignar título.
    document.getElementById('title').innerText = movie.title;
    // Asignar descripción.
    document.getElementById('description').innerText = movie.description;
    // Eliminar clase de espera de la página.
    document.querySelector('div.page-container').classList.remove('waiting');
  }).catch(err => {
    console.error(err)
    alert('No se encontró la película solicitada');
    const params = currSession
      ? `?session=${currSession}`
      : '';

    window.location.assign(window.location.origin + params);
  });
