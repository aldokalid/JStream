/** La clase genérica que heredan las demás definiciones de clases. */
class Generic {
  constructor(private id: number) { }

  /** Obtiene el identificador asignado por la fuente de datos. */
  getId() {
    return this.id;
  }

  /** Asigna un identificador al objeto. */
  setId(id: number) {
    this.id = id;
  }
}

export default Generic;