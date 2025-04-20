import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CallbackAssignerObject } from 'src/app/models/callback-assigner.model';
import { LoadWrapComponent } from 'src/app/shared/components/generic/load-wrap/load-wrap.component';
import { LoginPopupComponent } from 'src/app/shared/components/login-popup/login-popup.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { SessionPopupComponent } from 'src/app/shared/components/session-popup/session-popup.component';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-home',
  standalone: true, // (Requerido en Angular 18<).
  imports: [
    LoadWrapComponent,
    LoginPopupComponent,
    NavbarComponent,
    NgIf,
    RouterOutlet,
    SessionPopupComponent
  ], templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  @ViewChild('homeComponent') private homeComponent!: ElementRef<HTMLDivElement>;
  private currPopup?: 'login' | 'session';
  private loadingWrapper: boolean = false;
  private loadWrapCallbackAssigner: CallbackAssignerObject = {};

  constructor(private session: SessionService) { }

  /** Obtiene el popup actualmente renderizado. */
  getCurrPopup() {
    return this.currPopup;
  }

  /** Verifica si la pantalla de carga se está renderizando. */
  isLoadWrapRendering() {
    return this.loadingWrapper;
  }

  /** Obtiene el CallBackAssignerObject de la pantalla de carga. */
  getLoadWrapCallbackAssigner() {
    return this.loadWrapCallbackAssigner;
  }

  // *** EVENT HANDLERS ***
  // Se definen como funciones flecha para que el contexto this haga referencia a esta clase.
  /** Elimina la pantalla de carga del DOM. */
  disposeLoadingWrapper = () => {
    delete this.loadWrapCallbackAssigner.executer;
    this.loadingWrapper = false;
  }

  /** Elimina el popup actual del DOM. */
  disposePopup = () => {
    this.currPopup = undefined;
  }

  /** Función 'onReject' para el popup login. */
  onLoginPopupReject = (err: Error | string | 'password' | 'username') => {
    // @deprecated mostrar mensaje de error con alert-banner.component
    alert(`No se pudo iniciar sesión (${err})`);
  }

  /** Función 'onResolve' para el popup login. */
  onLoginPopupResolve = (res: string) => {
    // @deprecated Solo para fines simulados.
    this.session.login(res);
    // Oculta la cortina de carga.
    this.loadWrapCallbackAssigner.executer
      && this.loadWrapCallbackAssigner.executer();
    // @deprecated mostrar mensaje de bienvenida con alert-banner.component.
    alert(`Bienvenido, ${this.session.getSession()}.`);
  }

  /** Renderiza la pantalla de carga. */
  renderLoadingWrapper = () => {
    this.loadingWrapper = true;
  }

  /** Renderiza el popup login. */
  renderLoginPopup = () => {
    this.currPopup = this.session.getSession() ? 'session' : 'login';
  }

  // *** GET / SET ***
  /** Obtiene la referencia de este componente. */
  getHomeComponent() {
    return this.homeComponent;
  }

  /** Obtiene la sesión actual. */
  getSession() {
    return this.session.getSession();
  }
}
