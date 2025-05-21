export default interface InputbarValidatorObject {
  /** Cuando la función 'validate' se incumple, se mostrara este mensaje en la cabecera del componente. */
  rejectPlaceholder?: string,
  /** La función 'callback' de validación de entradas. */
  validate: (input?: string) => boolean
}