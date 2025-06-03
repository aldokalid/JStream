import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadWrapComponent } from 'src/app/shared/components/generic/load-wrap/load-wrap.component';
import { LoginPopupComponent } from 'src/app/shared/components/login-popup/login-popup.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { SessionPopupComponent } from 'src/app/shared/components/session-popup/session-popup.component';
import { LoadWrapService } from 'src/app/shared/services/load-wrap.service';

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

export class HomeComponent implements OnInit {
  @ViewChild('homeComponent') private homeComponent!: ElementRef<HTMLDivElement>;
  private currPopup?: 'login' | 'session';
  private loadingWrapper: boolean = false;
  private currSession?: string;

  constructor(private loadWrapService: LoadWrapService, private auth: AuthService) {

  }

  // *** ANGULAR ***
  ngOnInit(): void {
    this.auth.isLogged$.subscribe({
      next: user => {
        if (user)
          this.currSession = user.getUsername();
      }
    });

    this.auth.checkSession();
  }

  /** Obtiene el popup actualmente renderizado. */
  getCurrPopup() {
    return this.currPopup;
  }

  /** Verifica si la pantalla de carga se está renderizando. */
  isLoadWrapRendering() {
    return this.loadingWrapper;
  }

  // *** EVENT HANDLERS ***
  // Se definen como funciones flecha para que el contexto this haga referencia a esta clase.
  /** Elimina la pantalla de carga del DOM. */
  disposeLoadingWrapper = () => {
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
    // Oculta la cortina de carga.
    this.loadWrapService.loadWrapOnHideExecute();
    // @deprecated mostrar mensaje de bienvenida con alert-banner.component.
    alert(`Bienvenido, ${res}.`);
  }

  /** Renderiza la pantalla de carga. */
  renderLoadingWrapper = () => {
    this.loadingWrapper = true;
  }

  /** Renderiza el popup login o session. */
  renderPopup = () => {
    this.currPopup = this.currSession ? 'session' : 'login';
  }

  // *** GET / SET ***
  /** Obtiene la referencia de este componente. */
  getHomeComponent() {
    return this.homeComponent;
  }

  /** Obtiene la sesión actual. */
  getSession() {
    return this.currSession
  }
}
