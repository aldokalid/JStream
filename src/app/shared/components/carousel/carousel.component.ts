import { NgIf } from '@angular/common';
import { Component, Input, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Media from 'src/app/models/media.model';

@Component({
  selector: 'app-carousel',
  standalone: true, // Angular 18.
  imports: [NgIf],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnDestroy {
  private _currInterval?: NodeJS.Timeout | number | string;
  private _currTimeout?: NodeJS.Timeout | number | string;
  private _currMedia?: Media;
  private _medias: Media[] = []
  private _nextMedia?: Media;
  private _nextMediaIndex: number = 0;

  // NgZone es necesario para evitar que la página se quede colgada al iniciar un intervalo.
  // (usar Observable's implica hacer más código que usar solo NgZone. :P).
  constructor(private _ngZone: NgZone, private router: Router) { }

  // *** ANGULAR ***
  // "Al salir del componente, haz...".
  ngOnDestroy(): void {
    if (this._currInterval) {
      clearInterval(this._currInterval);
      clearTimeout(this._currTimeout);
    }
  }

  // *** EVENTOS ***
  onCarouselItemClick(id?: number) {
    if (!id)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id } });
  }

  // *** GENÉRICOS ***
  /** Inicia el componente carrusel. */
  private runCarousel() {
    if (!this.getMedias(true).length)
      return;

    if (this._currInterval)
      clearInterval(this._currInterval);

    // Obtiene el primer elemento de las tendencias.
    this._currMedia = this.getMedias(true)[0];

    // Aborta el efecto carrusel si solo hay una tendencia.
    if (this.getMedias(true).length === 1)
      return;

    // ** EFECTO CARRUSEL **
    // NgZone evita que Angular detecte los cambios de un intervalo.
    this._ngZone.runOutsideAngular(() => {
      this._currInterval = setInterval(() => {
        // Obtiene el índice de la siguiente tendencia.
        this._nextMediaIndex = this._nextMediaIndex < this.getMedias(true).length - 1
          ? this._nextMediaIndex + 1
          : 0;
        // Asigna la siguiente tendencia.
        this._nextMedia = this.getMedias(true)[this._nextMediaIndex];
        // Obliga a Angular a registrar el cambio.
        this._ngZone.run(() => { });
      }, 7000);
    });
  }

  /** Método que se activa cuando la nueva sugerencia de tendencia se ha terminado de renderizar */
  nextMediaAnimationEndHandler() {
    // Asigna la siguiente tendencia como la tendencia actual.
    this._currMedia = this._nextMedia;
    // Elimina la siguiente tendencia.
    this._nextMedia = undefined;
  }

  // *** GET / SET ***
  /** Obtiene el arreglo de películas y series.
   * @param onlyTendencies Si 'true', solo devolverá las tendencias.
   */
  getMedias(onlyTendencies?: boolean) {
    return onlyTendencies
      ? this._medias?.filter(m => m.getIsTendency()) ?? []
      : this._medias ?? [];
  }

  @Input()
  set medias(medias: Media[]) {
    this._medias = medias;

    this.runCarousel();
  }

  getCurrentMedia() {
    return this._currMedia;
  }

  getNextMedia() {
    return this._nextMedia;
  }
}
