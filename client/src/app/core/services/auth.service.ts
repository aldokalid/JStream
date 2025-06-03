import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, defer, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private session$ = new BehaviorSubject<User | null>(null);
  public isLogged$ = this.session$.asObservable();

  /** Guarda un elemento al localStorage.
   * @param key Llave del elemento.
   * @param value Valor del elemento.
   * @returns La llave asignada (key)
   */
  public saveToStorage = (key: string, value: string) => defer(() => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
      return of(key);
    } else
      return of(key);
  });

  /** Obtiene un elemento de localStorage.
   * @param key La llave de acceso del elemento.
   */
  public getFromStorage = (key: string) => defer(() => {
    if (isPlatformBrowser(this.platformId)) {
      return of(localStorage.getItem(key));
    } else
      return of(null);
  });

  /** Elimina un elemento de localStorage.
   * @param key La llave del elemento.
   */
  public removeFromStorage = (key: string) => defer(() => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
      return of();
    } else
      return of();
  });

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  /** Obtiene el URL de la API. */
  private getAPIUrl(): string {
    const protocol: string = environment.PRODUCTION
      ? 'https'
      : 'http';
    const server: string = environment.SERVER_NAME;
    const port: string = environment.PORT;

    return `${protocol}://${server}${port ? `:${port}` : ''}/api/auth/`;
  }

  /** Revisa que el token de sesión esté activo. */
  checkSession() {
    let jwtToken: string = '';

    this.getFromStorage('jwt').subscribe({
      next: token => jwtToken = token ?? ''
    });

    if (!jwtToken)
      return this.session$.next(null);

    const headers = new HttpHeaders().set("Authorization", `Bearer ${jwtToken}`);

    this.http.get(this.getAPIUrl() + 'data', { headers }).subscribe({
      next: (data: any) => {
        this.session$.next(!data ? null : new User(new Date(), data['username']));
      },
      error: () => {
        // No autorizado. Solicita un nuevo token.
        this.http.get(this.getAPIUrl() + `new_token/${jwtToken}`).subscribe({
          next: (data: any) => {
            this.saveToStorage('jwt', data['token']).subscribe();
            this.session$.next(new User(new Date(), data['username']))
          },
          error: () => {
            // No autorizado o solicitud mala.
            this.removeFromStorage('jwt').subscribe();
            this.session$.next(null);
          }
        })
      }
    });
  }

  /** Inicia sesión con las credenciales dadas.
   * @param username 
   * @param password 
   */
  signIn(username: string, password: string) {
    const url = this.getAPIUrl() + 'signin';
    const body = { username, password };

    this.http.post(url, body).subscribe({
      next: (res: any) => {
        this.saveToStorage('jwt', res.token).subscribe();
        this.session$.next(new User(new Date(), username))
      },
      error: err => {
        this.session$.error(err);
      }
    })
  }

  /** Cierra la sesión, caducando el token en el servidor. */
  signOut() {
    let jwtToken: string = '';

    this.getFromStorage('jwt').subscribe({
      next: token => jwtToken = token ?? ''
    });
    this.removeFromStorage('jwt').subscribe();

    const url = this.getAPIUrl() + 'signout';
    const headers = new HttpHeaders()
      .set("Authorization", `Bearer ${this.getFromStorage('jwt')}`)
      .set("Content-Type", 'application/json');

    this.http.post(url, { headers }).subscribe({
      next: () => this.session$.next(null),
      error: err => {
        console.error(err);
        this.session$.next(null);
      }
    })
  }
}
