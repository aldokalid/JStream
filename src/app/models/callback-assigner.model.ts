/** Un objecto de asignación utilizado por componentes en NgOnInit() */
export interface CallbackAssignerObject {
  /** La función asignada por un componente. */
  executer?: (...args: any[]) => any
}