import { Injectable } from '@angular/core';

/** Servicio para el control de inicio de sesión */
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private static session?: string;

  constructor() {   }

  /** Obtiene la sesión actual. */
  getSession() {
    return SessionService.session;
  }

  /** Inicia sesión */
  login(session: string) {
    SessionService.session = session;
  }

  /** Cierra sesión. */
  logout() {
    SessionService.session = undefined;
  }
}
