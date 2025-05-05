import Generic from "./generic.model";

class Media extends Generic {
  constructor(
    id: number,
    private background: string,
    private cover: string,
    private description: string,
    private genre: string,
    private isTendency: boolean,
    private release: number,
    private title: string,
    private type: 'serie' | 'movie',
  ) {
    super(id);
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

  setRelease(release: number) {
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