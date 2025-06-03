import DBMedia from "./dbmedia.interface";
import Generic from "./generic.model";

class Media extends Generic {
  constructor(
    id: number,
    private background: string,
    private cover: string,
    private description: string,
    private genre: string,
    private isTendency: boolean,
    private release: Date,
    private title: string,
    private type: 'serie' | 'movie',
  ) {
    super(id);
  }

  /** Convierte un objeto con interfaz DBMedia a un objeto Media. */
  static parseDBMedia(dbMedia: DBMedia): Media {
    return new Media(
      dbMedia.idmedia,
      dbMedia.background_img,
      dbMedia.cover_img,
      dbMedia.description,
      Media.parseGenreToString(dbMedia.genre),
      dbMedia.is_tendency,
      dbMedia.release,
      dbMedia.title,
      Media.parseType(dbMedia.type)
    );
  }

  /** Convierte el identificador del género en número a cadena. */
  static parseGenreToString(genre: number) {
    switch (genre) {
      case 1: return 'action';
      case 2: return 'comedy';
      case 3: return 'crime';
      case 4: return 'drama';
      case 5: return 'sci_fi';
      default: return 'unknown';
    }
  }

  /** Convierte el identificador del género en cadena a número. */
  static parseGenreToNumber(genre: string) {
    switch (genre) {
      case 'action': return 1;
      case 'comedy': return 2;
      case 'crime': return 3;
      case 'drama': return 4;
      case 'sci_fi': return 5;
      default: return 0; // Todos los géneros.
    }
  }

  static parseType(type: number) {
    switch (type) {
      case 2: return 'serie';
      default: return 'movie';
    }
  }

  getBackground() {
    return this.background
      ? `../../assets/images/${this.background}`
      : '';
  }

  setBackground(background: string) {
    this.background = background;
  }

  getCover() {
    return this.cover
      ? `../../assets/images/${this.cover}`
      : '';
  }

  setCover(cover: string) {
    this.cover = cover;
  }

  getDescription() {
    return this.description;
  }

  setDescription(description: string) {
    this.description = description;
  }

  getGenre() {
    return this.genre;
  }

  setGenre(genre: string) {
    this.genre = genre;
  }

  getIsTendency() {
    return this.isTendency;
  }

  setIsTendency(isTendency: boolean) {
    this.isTendency = isTendency;
  }

  getRelease() {
    return this.release;
  }

  setRelease(release: Date) {
    this.release = release;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title: string) {
    this.title = title;
  }

  getType() {
    return this.type;
  }

  setType(type: 'serie' | 'movie') {
    this.type = type;
  }
}

export default Media