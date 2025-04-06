import DOMRender from "./objects/DOMRender.js";

// Definiciones de tipo.
/** MovieObject typedef
 * @typedef {Object} MovieObject
 * @property {string} background The movie's background. 
 * @property {string} cover The movie's cover.
 * @property {string} description The movie's description.
 * @property {string} genre The movie's genre.
 * @property {number} id The movie's id.
 * @property {boolean} isTendency Specifies if the instance is a tendency.
 * @property {number} release Date of release.
 * @property {string} title Movie or serie title.
 * @property {'movie'|'serie'} type Movie type.
 */

// Globales.
/** @type {MovieObject[]|undefined} */
let movies;
/** @type {string|undefined} */
let currSession = DOMRender.getParam('session');
/** @type {number} */
let currentCarouselItemPos;

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
// Tendencias.
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

    // Tendencias.
    const tendenciesCompo = document.getElementById('options-container');
    const tendencies = movies.filter(m => m.isTendency);

    if (tendenciesCompo) {
      DOMRender.renderMovieItem(tendencies, tendenciesCompo);
    }

    // Carrusel.
    /** Función de callback para redirigir a la página "movie.html" */
    const goToMovie = id => {
      let params = `?movie=${id}`
      params += currSession
        ? `&session=${currSession}`
        : '';

      window.location.assign(window.location.origin + '/movie.html' + params);
    }

    currentCarouselItemPos = 0;
    DOMRender.renderCarouselItem(tendencies[0], goToMovie);

    setInterval(() => {
      currentCarouselItemPos = currentCarouselItemPos >= tendencies.length - 1
        ? 0 : currentCarouselItemPos + 1;

      DOMRender.renderCarouselItem(tendencies[currentCarouselItemPos], goToMovie);
    }, 7000);
  }).catch(err => console.error(err));
