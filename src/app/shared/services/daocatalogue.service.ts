import { Injectable } from '@angular/core';
import * as data from '../../data/movies.json';
import Media from 'src/app/models/media.model';

/** DAO para el catálogo de películas. */
@Injectable({
  providedIn: 'root'
})
export class DAOCatalogueService {
  private _catalogue: Media[] = [];

  constructor() {
    const rawMedia = ((data as any).default as any[]);

    rawMedia.forEach(aM => {
      this._catalogue.push(new Media(
        aM.id,
        aM.background,
        aM.cover,
        aM.description,
        aM.genre,
        aM.isTendency,
        aM.release,
        aM.title,
        aM.type
      ));
    });
  }

  /** Busca un elemento del catálogo a través del identificador */
  findMedia(id: number) {
    return this._catalogue.find(m => m.getId() === id);
  }

  /** Obtiene todo el catálogo de películas y series. */
  getCatalogue() {
    return this._catalogue;
  }

  getCatalogueByGenre(genre: string) {
    return this._catalogue.filter(m => m.getGenre() === genre)
  }

  /** Obtiene todas las tendencias. */
  getTendencies() {
    return this._catalogue.filter(m => m.getIsTendency());
  }

  /** Busca, por títulos, coincidencias en el catálogo. */
  searchCatalogue(title: string) {
    return this._catalogue.filter(m => {
      return m
        .getTitle()
        .toLowerCase()
        .includes(title.toLowerCase().trim().replace(/\s+/g, ' '));
    });
  }
}
