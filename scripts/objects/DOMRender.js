/** La clase estática para manipular el DOM */
class DOMRender {
  /** Elimina el atributo 'inert' a todos los nodos hijo directos de body */
  static activateBody() {
    const body = document.querySelector('body');

    Array.from(body.children).forEach(node => node.removeAttribute('inert'));
  }

  /** Manejador del evento 'animationend' para componentes popup. Este método se encarga
   * de quitar la clase 'show' cuando el elemento ha terminado de renderizarse y de eliminarlo
   * cuando ha desaparecido de la pantalla. También elimina el atributo 'inert' de los componentes
   * hermano, pero no lo agrega.
   * @param {AnimationEvent} e
   * @param {Element} toCompare The HTMLElement to compare.
   */
  static animationEndHandler(e, toCompare) {
    if (!(e instanceof AnimationEvent))
      throw new Error(`An AnimationEvent instance expected, got ${e}`);
    else if (!toCompare)
      throw new Error(`Element to compare expected to be defined`);

    if (e.target === toCompare) {
      const classList = Array.from(toCompare.classList);

      if (classList.includes('show'))
        toCompare.classList.remove('show');
      else if (classList.includes('hide')) {
        toCompare.remove();
        DOMRender.activateBody();
      }
    }
  }

  /** Cierra el componente de carga actualmente en el DOM. */
  static disposeLoadingWrapper() {
    // Revisa si el componente está renderizado.
    let loadingWrapper = document.getElementById('loading-wrapper');

    if (!loadingWrapper)
      throw new Error('Loading wrapper component is not in DOM');

    loadingWrapper.classList.add('hide');
  }

  /** Cierra el componente de sesión del DOM. */
  static disposeSessionPopup() {
    // Revisa si el componente está renderizado.
    let accountPopup = document.getElementById('account-popup');

    if (!accountPopup)
      throw new Error('Account popup component is not in DOM');

    accountPopup.classList.add('hide');
  }

  /** Obtiene un parámetro de la ubicación actual
   * @param {string} paramName El nombre del parámetro
   */
  static getParam(paramName) {
    const auxUrl = new URL(window.location.href);

    return auxUrl.searchParams.get(paramName) || undefined;
  }

  /** Agrega el atributo 'inert' a un nodo hijo directo de 'body'. El elemento proporcionado en
   * los argumentos será omitido (si es hijo directo de body).
   * @param {Element} [e]
   */
  static inertBody(e) {
    const body = document.querySelector('body');

    Array.from(body.children).forEach(node => node !== e && node.setAttribute('inert', ''));
  }

  /** Renderiza un nuevo elemento en el carrusel
   * @param {import("..").MovieObject} movie
   * @param {(id: number) => void} onShow
   */
  static renderCarouselItem(movie, onShow) {
    if (!movie || typeof onShow !== 'function')
      throw new Error('One or both parameters are invalid');

    const carousel = document.getElementById('carousel');

    if (!carousel)
      throw new Error('No carousel component found');

    carousel.classList.remove('waiting');

    // Prepara el nuevo elemento para el carrusel.
    const carItem = document.createElement('div');
    carItem.className = 'carousel-item';
    carItem.id = `carousel-item-${movie.id}`

    carItem.innerHTML = `
      <div class="carousel-img-container">
        <img src="${movie.background}" alt="movie-img">
        <span class="carousel-curtain"></span>
      </div>
      <div class="carousel-info-container">
        <h2 class="carousel-title">${movie.title}</h2>
        <button>Abrir</button>
      </div>`;

    const openBtn = carItem.querySelector('button');
    openBtn.addEventListener('click', () => onShow(movie.id));

    carItem.addEventListener('animationend', () => {
      if (carousel.children.length > 1) {
        carousel.children[0].remove();
      }
    });

    carousel.appendChild(carItem)
  }


  /** Renderiza un componente de carga */
  static renderLoadingWrapper() {
    // Revisa si el componente está renderizado.
    let loadingWrapper = document.getElementById('loading-wrapper');

    if (loadingWrapper)
      throw new Error('Loading wrapper component is currently in DOM');

    // Deshabilita los componentes atuales en body.
    DOMRender.inertBody();

    loadingWrapper = document.createElement('div');
    loadingWrapper.id = 'loading-wrapper';
    loadingWrapper.className = 'show';
    loadingWrapper.innerHTML = `
      <div class="loading-figure-container">
        <span class="loading-figure"></span>
      </div>`;

    // ** EVENTOS **
    loadingWrapper.addEventListener('animationend', e => DOMRender.animationEndHandler(e, loadingWrapper));

    // Ancla el elemento en el DOM.
    document.querySelector('body').appendChild(loadingWrapper);
  }

  /** Renderiza un componente popup para iniciar sesión.
   * @param {(session: string) => void} onLogin Una función callback que se activará cuando se
   * inicie sesión. El parámetro devuelto es el nombre de usuario de la sesión.
   */
  static renderLoginPopup(onLogin) {
    // Revisa si el componente está renderizado.
    if (document.getElementById('login-popup'))
      throw new Error('Login popup component is currently in DOM');

    // Deshabilita los componentes atuales en body.
    DOMRender.inertBody();

    const body = document.querySelector('body');
    // Cortina.
    const popupWrapper = document.createElement('div');
    popupWrapper.id = 'login-popup';
    popupWrapper.className = 'popup-wrapper show';

    popupWrapper.innerHTML = `
      <div class="popup">
        <div class="popup-top-bar">
          <p>Iniciar sesión</p>
          <button id="popup-close-btn">X</button>
        </div>
        <div class="popup-content">
          <input type="text" id="popup-username-input" placeholder="Nombre de usuario" maxlength="15">
          <input type="password" id="popup-password-input" placeholder="Contraseña">
          <button id="popup-login-btn">Iniciar sesión</button>
        </div>
      </div>`;

    // Append to DOM.
    body.appendChild(popupWrapper);

    // ** EVENTOS **
    // Cortina.
    popupWrapper.addEventListener('animationend', e => DOMRender.animationEndHandler(e, popupWrapper));

    // Botón cerrar.
    const closeBtn = document.getElementById('popup-close-btn');
    closeBtn.addEventListener('click', () => popupWrapper.classList.add('hide'));
    // Botón de iniciar sesión.
    const loginBtn = document.getElementById('popup-login-btn');
    loginBtn.addEventListener('click', () => {
      // Obteniendo entradas.
      /** @type {HTMLInputElement} */
      const usernameInput = document.getElementById('popup-username-input');
      /** @type {HTMLInputElement} */
      const passwordInput = document.getElementById('popup-password-input');

      if (!usernameInput?.value) {
        alert('Ingresa tu nombre de usuario');
        return;
      } else if (!passwordInput?.value) {
        alert('Ingresa tu contraseña');
        return;
      }

      DOMRender.renderLoadingWrapper();

      setTimeout(() => {
        popupWrapper.classList.add('hide');
        DOMRender.disposeLoadingWrapper();
        onLogin(usernameInput.value);
        alert(`Bienvenido, ${usernameInput.value}`);
      }, 3000);
    });
  }

  /** Renderiza un elemento MovieItem dentro del nodo deseado.
   * @param {import("..").MovieObject[]} movies
   * @param {Element} element
   */
  static renderMovieItem(movies, element) {
    if (!movies || movies.length === 0 || !element)
      throw new Error('One or both of the parameters is undefined');

    movies.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.className = 'movie-item';
      movieItem.id = movie.id;

      movieItem.innerHTML = `
        <div class="movie-img-container">
          <img src="${movie.cover}" alt="movie-img">
        </div>
        <h4 class="movie-title">${movie.title}</h4>`;

      element.appendChild(movieItem);
    });
  }

  /** Renderiza películas */

  /** Renderiza un popup de sesión iniciada. */
  static renderSessionPopup() {
    // Revisa que el popup no esté renderizado, ni el de iniciar sesión.
    if (document.getElementById('account-popup'))
      throw new Error('Account popup component is already in the DOM');

    // Crear componente.
    const popup = document.createElement('div');
    popup.id = 'account-popup';
    popup.className = 'show';
    popup.innerHTML = `
      <h2 id="welcome-message">Hola</h2>
      <hr>`

    const exitBtn = document.createElement('button')
    exitBtn.textContent = 'Salir';
    exitBtn.addEventListener('click', e => {
      e.stopPropagation();
      window.location.replace(window.location.origin)
    });
    popup.appendChild(exitBtn);

    popup.addEventListener('animationend', e => DOMRender.animationEndHandler(e, popup));
    // Incluir componente a body.
    document.querySelector('body').append(popup);

    /** Función para evento del documento (si se pulsa fuera del popup, se cerrará).
     * @param {MouseEvent} e
     */
    const clickedOutOfComponent = e => {
      if (!popup.contains(e.target)) {
        DOMRender.disposeSessionPopup();
        document.removeEventListener('click', clickedOutOfComponent);
      }
    }

    document.addEventListener('click', clickedOutOfComponent);
  }
}

export default DOMRender;