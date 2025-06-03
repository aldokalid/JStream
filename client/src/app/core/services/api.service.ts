import { Injectable } from '@angular/core';
import Media from 'src/app/models/media.model';
import { map, Observable } from 'rxjs';
import DBMedia from 'src/app/models/dbmedia.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

/** Servicio para el catálogo de películas. */
@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(private http: HttpClient) { }

  private getAPIUrl(): string {
    const protocol: string = environment.PRODUCTION
      ? 'https'
      : 'http';
    const server: string = environment.SERVER_NAME;
    const port: string = environment.PORT;

    return `${protocol}://${server}${port ? `:${port}` : ''}/api/medias/`;
  }

  /** Obtiene coincidencias, mediante el título, en el catálogo desde la API. */
  findMediaByTitle$(title: string): Observable<Media[]> {
    return this.http.get<DBMedia[]>(this.getAPIUrl() + `title/${title}`).pipe(
      map(res => res.map(dbMedia => Media.parseDBMedia(dbMedia)))
    );
  }

  /** Obtiene coincidencias, mediante categoría, en el catálogo desde la API. */
  findMediaByGenre$(genre: number): Observable<Media[]> {
    return this.http.get<DBMedia[]>(this.getAPIUrl() + `genre/${genre}`).pipe(
      map(res => res.map(dbMedia => Media.parseDBMedia(dbMedia)))
    );
  }

  /** Obtiene un objeto del catálogo desde la API. */
  getMedia$(id: number): Observable<Media> {
    return this.http.get<DBMedia>(this.getAPIUrl() + `id/${id}`).pipe(
      map(res => Media.parseDBMedia(res))
    );
  }

  /** Obtiene todo el catálogo desde la API. */
  getMedias$(): Observable<Media[]> {
    return this.http.get<DBMedia[]>(this.getAPIUrl()).pipe(
      map(res => res.map(dbMedia => Media.parseDBMedia(dbMedia)))
    );
  }
}
