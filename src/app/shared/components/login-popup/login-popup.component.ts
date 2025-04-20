import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login-popup',
  standalone: true, // Angular 18.
  imports: [],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss'
})
export class LoginPopupComponent {
  /** Una función que se activará cuando se haga clic en 'Iniciar sesión'.
   * @deprecated En el futuro, la función debe recibir el nombre de usuario y contraseña ingresados,
   * y regresar una promesa del backend. */
  @Input() onAction!: () => void
  /** Una función que se activará cuando el componente se haya ocultado del DOM. */
  @Input() onDispose!: () => void;
  /** Una función que se activará cuando el login ha fallado (error de comunicación o campos vacíos). */
  @Input() onReject!: (err: Error | string | 'password' | 'username') => void;
  /** Una función que se activará cuando el login se complete satisfactoriamente. Después de
   * activar esta función, el componente se esconderá y, finalmente, se activará 'onDispose'.
   * @deprecated La función solo devuelve el nombre de usuario ingresado. En el futuro, debe
   * devolver la respuesta del backend. */
  @Input() onResolve!: (res: string) => void;
  /** Referencia a la cortina del componente */
  @ViewChild('loginWrapper') loginWrapper!: ElementRef;

  /** En estado 'true', el componente no es interactuable. */
  private _compoWait: boolean = false;
  private _statusClass: ' show' | ' hide' | '' = ' show';
  private _password?: string;
  private _username?: string;

  constructor(private ngZone: NgZone) { }

  // *** EVENTOS ***
  /** Activado cuando se hace clic en el botón Cerrar. */
  onCloseBtnClick() {
    this._statusClass = ' hide';
  }

  onComponentAnimationEnd(e: AnimationEvent) {
    // Verifica que el elemento que lanzó el evento sea la cortina del componente.
    if (this.loginWrapper.nativeElement !== e.target)
      return;

    if (this._statusClass === ' show')
      this._statusClass = '';
    else
      this.onDispose();
  }

  /** Activado cuando una entrada cambia. */
  onInputChange(e: Event, type: 'username' | 'password') {
    // Cambio el tipo de dato porque 'value' no se puede acceder desde el evento.
    const inputEvent = (e.target as HTMLInputElement | null);

    if (type === 'username')
      this.setUsername(inputEvent?.value);
    else
      this.setPassword(inputEvent?.value);
  }

  /** Activado cuando se hace clic en el botón Iniciar sesión. */
  onLoginBtnClick() {
    if (!this._username || !this._password) // Rechazar el inicio de sesión.
      return;

    this._compoWait = true;

    // @deprecated La función debe ser llamada asíncronamente (dentro de ngZone).
    this.onAction();

    // Validación de credenciales (@deprecated solo simulado).
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.onResolve(this._username as string);
        this._statusClass = ' hide';
        this.ngZone.run(() => { });
      }, 3000);
    });
  }

  // *** GENÉRICOS ***
  isWaiting() {
    return this._compoWait;
  }

  // *** GET / SET ***
  /** Obtiene el estado actual del componente. */
  getStatusClass() {
    return this._statusClass
  }

  getUsername() {
    return this._username;
  }

  setUsername(username?: string) {
    this._username = username;
  }

  getPassword() {
    return this._password;
  }

  setPassword(password?: string) {
    this._password = password;
  }
}
