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
  standalone: true, // Angular 18.
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
  @ViewChild('homeComponent') private _homeComponent!: ElementRef<HTMLDivElement>;
  private _currPopup?: 'login' | 'session';
  private _loadingWrapper: boolean = false;
  private _loadingWrapperCallbackAssigner: CallbackAssignerObject = {};

  constructor(private session: SessionService) { }

  getCurrPopup() {
    return this._currPopup;
  }

  getLoadingWrapperStatus() {
    return this._loadingWrapper;
  }

  getLoadingWrapperCallbackAssigner() {
    return this._loadingWrapperCallbackAssigner;
  }

  // *** EVENT HANDLERS ***
  // Se definen como funciones flecha para que el contexto this haga referencia a esta clase.
  disposeLoadingWrapper = () => {
    delete this._loadingWrapperCallbackAssigner.executer;
    this._loadingWrapper = false;
  }

  disposePopup = () => {
    this._currPopup = undefined;
  }

  onLoginPopupReject = (err: Error | string | 'password' | 'username') => {
    // @deprecated mostrar mensaje de error
  }

  onLoginPopupResolve = (res: string) => {
    // @deprecated Solo para fines simulados.
    this.session.login(res);
    // Oculta la cortina de carga.
    this._loadingWrapperCallbackAssigner.executer
      && this._loadingWrapperCallbackAssigner.executer();
    // @deprecated mostrar mensaje de bienvenida.
    alert(`Bienvenido, ${this.session.getSession()}.`);
  }

  renderLoadingWrapper = () => {
    this._loadingWrapper = true;
  }

  renderLoginPopup = () => {
    this._currPopup = this.session.getSession() ? 'session' : 'login';
  }

  // *** GET / SET ***
  getHomeComponent() {
    return this._homeComponent;
  }

  getSession() {
    return this.session.getSession();
  }
}
