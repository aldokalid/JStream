/** Interfaz de Media, que es obtenida de la base de datos. */
export default interface DBMedia {
  idmedia: number,
  background_img: string,
  cover_img: string,
  description: string,
  genre: number,
  is_tendency: boolean,
  release: Date,
  title: string,
  type: number
}