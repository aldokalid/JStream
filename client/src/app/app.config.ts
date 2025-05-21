import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes, // Router
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }), // Restaura el scroll al navegar.
      withComponentInputBinding() // Ayuda a obtener parámetros del url con @Input().
    ), provideClientHydration(withEventReplay())
  ]
};
