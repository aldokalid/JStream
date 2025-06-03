import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import TestMedia from './app/data/movies.spec.json';
import Media from './app/models/media.model';
import DBMedia from './app/models/dbmedia.interface';
import { of } from 'rxjs';

/** Ejecuta la configuración de TestBed para soportar solicitudes HttpClient. */
export function setupHttpClientTestBed() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  });
}

/** Obtiene el catálogo de películas y series desde el archivo de pruebas.
 * @param filter Una función que puede filtrar el catálogo de pruebas según sus atributos. */
export const getTestMedia = (filter?: (medias: Media[]) => Media[]) => {
  // Obtiene el arreglo de prueba.
  let auxArr = (TestMedia as unknown as DBMedia[])
    .map(tM => Media.parseDBMedia(tM));

  if (filter)
    auxArr = filter(auxArr);

  return of(auxArr);
}
