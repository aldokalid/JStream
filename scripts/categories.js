import DOMRender from "./objects/DOMRender.js";

// Globales.
/** @type {import("./index.js").MovieObject[]|undefined} */
let movies;
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
// Categorías.
document
  .getElementById('categories-buttons-container')
  .addEventListener('click', e => {
    if (e.target.localName === 'button') {
      const newCat = e.target.id.split('-')[0];
      const optionsContainer = document.getElementById('options-container');

      // Elimina todas las películas actuales.
      while (optionsContainer.lastChild)
        optionsContainer.lastChild.remove()

      // Agrega nuevas películas.
      DOMRender
        .renderMovieItem(newCat === 'all' ? movies : movies.filter(m => m.genre === newCat), optionsContainer);
      // Cambia el texto del título de la ubicación actual.
      document.getElementById('position-title').innerText = e.target.innerText;
    }
  });
// Resultados.

document
  .getElementById('options-container')
  .addEventListener('click', e => {
    if (e.target.id === 'options-container') return

    let movieItem = e.target;

    while (!movieItem.classList.contains('movie-item') || movieItem.localName === 'body')
      movieItem = movieItem.parentNode;

    if (movieItem.localName === 'body')
      throw new Error('Seach overflow! Could not find movie item');


    let params = `?movie=${movieItem.id}`;
    params += currSession
      ? `&session=${currSession}`
      : '';

    window.location.assign(window.location.origin + '/movie.html' + params);
  });

// ** FETCH **
fetch('assets/movies.json')
  .then(data => data.json())
  .then(json => {
    movies = json

    const optionsContainer = document.getElementById('options-container');

    if (optionsContainer) {
      DOMRender.renderMovieItem(movies, optionsContainer);
    }
  }).catch(err => console.error(err));
