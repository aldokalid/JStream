import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputbarComponent } from "../generic/input-bar/inputbar.component";
import { ButtonComponent } from "../generic/button/button.component";
import { Subject, Subscription } from 'rxjs';
import InputbarFilterObject from '../generic/input-bar/models/inputbarfilterobject.interface';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login-popup',
  standalone: true, // (Requerido en Angular 18<).
  imports: [InputbarComponent, ButtonComponent],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss'
})
export class LoginPopupComponent implements OnDestroy {
  /** Una función que se activará cuando se haga clic en 'Iniciar sesión'.
   * @deprecated Función marcada para eliminación */
  @Input({ required: true }) onAction!: () => void
  /** Una función que se activará cuando el componente se haya ocultado del DOM.
   * @deprecated Función marcada para eliminación */
  @Input({ required: true }) onDispose!: () => void;
  /** Una función que se activará cuando el login ha fallado (error de comunicación o campos vacíos).
   * @deprecated Función marcada para eliminación */
  @Input({ required: true }) onReject!: (err: Error | string | 'password' | 'username') => void;
  /** Una función que se activará cuando el login se complete satisfactoriamente. Después de
   * activar esta función, el componente se esconderá y, finalmente, se activará 'onDispose'.
   * @deprecated Función marcada para eliminación */
  @Input({ required: true }) onResolve!: (res: string) => void;
  /** Referencia a la cortina del componente */
  @ViewChild('loginWrapper') loginWrapper!: ElementRef;

  /** En estado 'true', el componente no es interactuable. */
  private compoWait: boolean = false;
  private password?: string;
  private statusClass: ' show' | ' hide' | '' = ' show';
  private username?: string;
  private login$?: Subscription;
  private buttonSubject$?: Subject<any>;

  constructor(private ngZone: NgZone, private auth: AuthService) { }

  // *** ANGULAR ***
  ngOnDestroy(): void {
    this.login$?.closed === false && this.login$.unsubscribe();
  }

  // *** EVENTOS ***
  /** Activado cuando se hace clic en el botón Cerrar. */
  onCloseBtnClick = () => {
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

  /** Detecta los cambios en el campo de usuario. */
  onUsernameInputbarChange = (input?: string) => {
    this.password = input;
  }

  onPasswordInputbarChange = (input?: string) => {
    this.username = input;
  }

  /** Controlador de clics para el botón Iniciar sesión. */
  onLoginBtnClick(e$: Subject<any>) {
    if (!this.username || !this.password) // Rechazar el inicio de sesión.
      return e$.complete();

    this.buttonSubject$ = e$;
    this.compoWait = true;

    // @deprecated revisar porqué esto funciona fuera de ngOnInit
    this.login$ = this.auth.isLogged$.subscribe({
      next: user => {
        if (user) {
          this.statusClass = ' hide';
          alert(`Bienvenido, ${user?.getUsername()}`);
        }
      },
      error: err => {
        console.error(err);
        this.compoWait = false;
        this.buttonSubject$?.complete();
      }
    });

    this.auth.login(this.username, this.password);
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

  getUsernameFilters(): InputbarFilterObject[] {
    return [
      {
        filter: (input?: string) => input?.toLowerCase()
      },
      {
        filter: /\s+/,
      }
    ]
  }
}
