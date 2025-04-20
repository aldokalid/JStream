import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NotFoundComponent } from '@core/not-found/not-found.component';
import Media from 'src/app/models/media.model';
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';

@Component({
  selector: 'app-media',
  standalone: true, // Angular 18.
  imports: [NgIf, NotFoundComponent],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {
  @Input() private id?: string;
  private _media?: Media;

  constructor(private _daoCatalogue: DAOCatalogueService) { }

  // *** ANGULAR ***
  ngOnInit(): void {
    // Obtiene la película respecto al id obtenido en queryParams.
    this._media = this._daoCatalogue.findMedia(Number(this.id))
      ?? new Media(0, '', '', '', '', false, 0, '', 'movie');
  }

  // *** GENÉRICOS ***
  /** Devuelve verdadero cuando no se ha encontrado el elemento en el catálogo. */
  noMediaFound() {
    return this._media && this._media?.getId() <= 0;
  }

  // *** GET / SET
  getBackground() {
    return `../../../assets/images/${this._media?.getBackground()}`;
  }

  getCover() {
    return `../../../assets/images/${this._media?.getCover()}`;
  }

  getDescription() {
    return this._media?.getDescription();
  }

  getTitle() {
    return this._media?.getTitle();
  }

  getStatusClass() {
    return this._media ? '' : ' wait';
  }
}
