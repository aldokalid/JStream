import { NgIf } from '@angular/common';
import { Component, Input, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Media from 'src/app/models/media.model';

@Component({
  selector: 'app-carousel',
  standalone: true, // (Requerido en Angular 18<).
  imports: [NgIf],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnDestroy {
  private _medias: Media[] = []; // Se define con guión bajo porque 'medias' es una propiedad HTML.
  private currInterval?: NodeJS.Timeout | number | string;
  private currMedia?: Media;
  private nextMedia?: Media;
  private nextMediaIndex: number = 0;

  // NgZone es necesario para evitar que la página se quede colgada al iniciar un intervalo.
  // (usar Observable's implica hacer más código que usar solo NgZone. :P).
  constructor(private _ngZone: NgZone, private router: Router) { }

  // *** ANGULAR ***
  /** Elimina el intervalo. */
  ngOnDestroy(): void {
    if (this.currInterval)
      clearInterval(this.currInterval);
  }

  // *** EVENTOS ***
  /** Controlador de clics para las tarjetas del carrusel. */
  onCarouselItemClick(id?: number) {
    if (!id)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id } });
  }

  /** Método que se activa cuando la nueva sugerencia de tendencia se ha terminado de renderizar */
  onNextMediaAnimationEnd() {
    // Asigna la siguiente tendencia como la tendencia actual.
    this.currMedia = this.nextMedia;
    // Elimina la siguiente tendencia.
    this.nextMedia = undefined;
  }

  // *** GENÉRICOS ***
  /** Inicializa el componente carrusel. */
  private runCarousel() {
    if (!this.getMedias().length)
      return;

    if (this.currInterval)
      clearInterval(this.currInterval);

    // Obtiene el primer elemento del catálogo.
    this.currMedia = this.getMedias()[0];

    // Aborta el efecto carrusel si solo hay un elemento en el catálogo.
    if (this.getMedias().length === 1)
      return;

    // ** EFECTO CARRUSEL **
    // NgZone evita que Angular detecte los cambios de un intervalo.
    this._ngZone.runOutsideAngular(() => {
      this.currInterval = setInterval(() => {
        // Obtiene el índice de la siguiente tendencia.
        this.nextMediaIndex = this.nextMediaIndex < this.getMedias().length - 1
          ? this.nextMediaIndex + 1
          : 0;
        // Asigna la siguiente tendencia.
        this.nextMedia = this.getMedias()[this.nextMediaIndex];
        // Obliga a Angular a registrar el cambio.
        this._ngZone.run(() => { });
      }, 7000);
    });
  }

  // *** GET / SET ***
  /** Obtiene el catálogo almacenado en este componente. */
  getMedias() {
    return this._medias;
  }

  /** Arreglo de películas y series para renderizar en el carrusel. */
  @Input()
  set medias(medias: Media[]) {
    this._medias = medias;

    this.runCarousel();
  }

  /** Obtiene el elemento del catálogo que se está renderizando. */
  getCurrentMedia() {
    return this.currMedia;
  }

  /** Obtiene el elemento del catálogo que está por renderizarse. */
  getNextMedia() {
    return this.nextMedia;
  }
}