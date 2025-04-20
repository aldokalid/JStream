import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login-popup',
  standalone: true, // (Requerido en Angular 18<).
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
  private compoWait: boolean = false;
  private password?: string;
  private statusClass: ' show' | ' hide' | '' = ' show';
  private username?: string;

  constructor(private ngZone: NgZone) { }

  // *** EVENTOS ***
  /** Activado cuando se hace clic en el botón Cerrar. */
  onCloseBtnClick() {
    this.statusClass = ' hide';
  }

  /** Controlador de fin de animación para el componente. */
  onComponentAnimationEnd(e: AnimationEvent) {
    // Verifica que el elemento que lanzó el evento sea la cortina del componente.
    if (this.loginWrapper.nativeElement !== e.target)
      return;

    if (this.statusClass === ' show')
      this.statusClass = '';
    else
      this.onDispose();
  }

  /** Controlador de cambios para las barras de texto. */
  onInputChange(e: Event, type: 'username' | 'password') {
    // Cambio el tipo de dato porque 'value' no se puede acceder desde el evento.
    const inputEvent = (e.target as HTMLInputElement | null);

    if (type === 'username')
      this.setUsername(inputEvent?.value);
    else
      this.setPassword(inputEvent?.value);
  }

  /** Controlador de clics para el botón Iniciar sesión. */
  onLoginBtnClick() {
    if (!this.username || !this.password) // Rechazar el inicio de sesión.
      return;

    this.compoWait = true;

    // @deprecated La función debe ser llamada asíncronamente (dentro de ngZone).
    this.onAction();

    // Validación de credenciales (@deprecated solo simulado).
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.onResolve(this.username as string);
        this.statusClass = ' hide';
        this.ngZone.run(() => { });
      }, 3000);
    });
  }

  // *** GENÉRICOS ***
  /** Verifica si el componente está en estado de espera. */
  isWaiting() {
    return this.compoWait;
  }

  // *** GET / SET ***
  /** Obtiene el estado actual del componente. */
  getStatusClass() {
    return this.statusClass
  }

  /** Asigna un nombre de usuario. */
  setUsername(username?: string) {
    this.username = username;
  }

  /** Asigna una contraseña. */
  setPassword(password?: string) {
    this.password = password;
  }
}
