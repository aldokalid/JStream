import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private static session?: string;

  constructor() {   }

  getSession() {
    return SessionService.session;
  }

  login(session: string) {
    SessionService.session = session;
  }

  logout() {
    SessionService.session = undefined;
  }
}
