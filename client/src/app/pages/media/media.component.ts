import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NotFoundComponent } from 'src/app/pages/not-found/not-found.component';
import { Subscription } from 'rxjs';
import Media from 'src/app/models/media.model';
import { APIService } from '@core/services/api.service';

@Component({
  selector: 'app-media',
  standalone: true, // (Requerido en Angular 18<).
  imports: [NgIf, NotFoundComponent],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnDestroy, OnInit {
  /** El identificador para consultar el contenido multimedia deseado. */
  @Input({ required: true }) private id?: string;
  private media?: Media;
  private media$?: Subscription;

  constructor(private api: APIService) { }

  // *** ANGULAR ***
  ngOnDestroy(): void {
    this.media$?.closed === false && this.media$.unsubscribe();
  }

  ngOnInit(): void {
    this.media$?.closed === false && this.media$.unsubscribe();
    // Obtiene la película mediante el id obtenido en queryParams.
    this.media$ = this.api.getMedia$(Number(this.id)).subscribe({
      next: data => this.media = data,
      error: err => {
        console.error(err);
        this.media = new Media(0, '', '', '', '', false, new Date(), '', 'movie');
      }
    });
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
