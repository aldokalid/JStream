import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-item',
  standalone: true, // Angular 18.
  imports: [NgIf, NgOptimizedImage],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.scss'
})
export class MediaItemComponent {
  private _cover?: string;
  private _id?: number | null;
  private _title?: string;

  getCover() {
    return this._cover;
  }

  @Input()
  set cover(cover: string) {
    this._cover = cover;
  }

  getId() {
    return this._id;
  }

  @Input()
  set id(id: number | null) {
    this._id = id;
  }

  getTitle() {
    return this._title;
  }

  @Input()
  set title(title: string) {
    this._title = title;
  }

  /** Revisa si el componente está listo para renderizarse. */
  renderable() {
    return Boolean(this._cover && this._id && this._title);
  }
}
