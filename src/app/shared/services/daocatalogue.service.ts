import { Injectable } from '@angular/core';
import * as data from '../../data/movies.json';
import Media from 'src/app/models/media.model';
import { Observable, of } from 'rxjs';

/** Servicio para el catálogo de películas. */
@Injectable({
  providedIn: 'root'
})
export class DAOCatalogueService {
  public catalogue$!: Observable<Media[]>;

  constructor() {
    const rawMedia = ((data as any).default as any[]);

    this.catalogue$ = of(rawMedia.map(aM => new Media(
      aM.id,
      aM.background,
      aM.cover,
      aM.description,
      aM.genre,
      aM.isTendency,
      aM.release,
      aM.title,
      aM.type
    )));
  }
}
