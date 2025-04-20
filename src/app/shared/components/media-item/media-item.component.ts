import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-item',
  standalone: true, // (Requerido en Angular 18<).
  imports: [NgIf, NgOptimizedImage],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.scss'
})
export class MediaItemComponent {
  private _cover?: string;
  private _id?: number | null;
  private _title?: string;

  // *** GENÉRICOS ***
  /** Revisa si el componente está listo para renderizarse. */
  renderable() {
    return Boolean(this._cover && this._id && this._title);
  }
  // *** GET / SET ***
  /** Obtiene la carátula. */
  getCover() {
    return this._cover;
  }

  /** Asgina una carátula */
  @Input()
  set cover(cover: string) {
    this._cover = cover;
  }

  /** Obtiene el identificador. */
  getId() {
    return this._id;
  }

  /** Asigna un identificador. */
  @Input()
  set id(id: number | null) {
    this._id = id;
  }

  /** Obtiene el título. */
  getTitle() {
    return this._title;
  }

  /** Asgina un título. */
  @Input()
  set title(title: string) {
    this._title = title;
  }
}
