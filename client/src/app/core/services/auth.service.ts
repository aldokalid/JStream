import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  public saveToStorage = (key: string, value: string) => defer(() => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
      return of();
    } else
      return of();
  });

  public getFromStorage = (key: string) => defer(() => {
    if (isPlatformBrowser(this.platformId)) {
      return of(localStorage.getItem(key));
    } else
      return of();
  });

  public removeFromStorage = (key: string) => defer(() => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
      return of();
    } else
      return of();
  });

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getAPIUrl(): string {
    const protocol: string = environment.PRODUCTION
      ? 'https'
      : 'http';
    const server: string = environment.SERVER_NAME;
    const port: string = environment.PORT;

    return `${protocol}://${server}${port ? `:${port}` : ''}/`;
  }

  checkSession() {
    this.getFromStorage('username').subscribe({
      next: username => {
        if (username) {
          this.http.post(this.getAPIUrl() + 'session', { username }).subscribe({
            next: data => {
              this.session$.next(!data ? null : new User(new Date(), username || ''))
            },
            error: err => {
              this.removeFromStorage('username').subscribe();
              this.session$.error(err);
            }
          });
        }
      }
    })
  }

  login(username: string, password: string) {
    this.http.post(this.getAPIUrl() + 'login', { username, password }).subscribe({
      next: () => {
        localStorage.setItem('username', username);
        this.session$.next(new User(new Date(), username))
      },
      error: err => {
        this.session$.error(err);
      }
    })
  }

  logout() {
    this.http.post(this.getAPIUrl() + 'logout', { username: localStorage.getItem('username') }).subscribe({
      next: () => {
        localStorage.removeItem('username');
        this.session$.next(null)
      },
      error: err => {
        console.error(err);
        this.session$.next(null);
      }
    })
  }
}
