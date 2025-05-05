import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NotFoundComponent } from '@core/not-found/not-found.component';
import { Subscription } from 'rxjs';
import Media from 'src/app/models/media.model';
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';

@Component({
  selector: 'app-media',
  standalone: true, // (Requerido en Angular 18<).
  imports: [NgIf, NotFoundComponent],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {
  /** El identificador para consultar el contenido multimedia deseado. */
  @Input({ required: true }) private id?: string;
  private media?: Media;
  private media$!: Subscription;

  constructor(private daoCatalogue: DAOCatalogueService) { }

  // *** ANGULAR ***
  ngOnInit(): void {
    // Obtiene la película respecto al id obtenido en queryParams.
    this.media$ = this.daoCatalogue.catalogue$.subscribe({
      next: data => {
        this.media = data.find(d => d.getId() === Number(this.id))
          ?? new Media(0, '', '', '', '', false, 0, '', 'movie');
      },
      error: err => {
        console.error(err);
      }
    });

    this.media$.unsubscribe();
  }

  // *** GENÉRICOS ***
  /** Devuelve verdadero cuando no se ha encontrado el elemento en el catálogo. */
  noMediaFound() {
    return this.media && this.media?.getId() <= 0;
  }

  // *** GET / SET
  getMedia() {
    return this.media;
  }

  /** Obtiene la clase de estado del componente para el control de animaciones. */
  getStatusClass() {
    return this.media ? '' : ' wait';
  }
}
