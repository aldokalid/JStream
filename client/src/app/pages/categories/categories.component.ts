import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Media from 'src/app/models/media.model';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { APIService } from '@core/services/api.service';
import { ButtonComponent } from "../../shared/components/generic/button/button.component";

@Component({
  selector: 'app-categories',
  standalone: true, // (Requerido en Angular 18<).
  imports: [MediaItemComponent, NgFor, NgIf, ButtonComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnDestroy, OnInit {
  /** La opción de categoría seleccionada (QueryParam). */
  @Input({ required: true }) private op: string = 'all';
  @ViewChild('categoriesButtonsContainer') categoriesButtonsContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('optionsContainer') optionsContainer!: ElementRef<HTMLDivElement>;

  private genres$?: Subscription;
  private medias?: Media[];
  private categoriesContainerStatusClass: ' show' | ' hide' | ' idle' | '' = '';

  constructor(private api: APIService, private router: Router) { }

  // *** ANGULAR ***
  ngOnDestroy(): void {
    this.genres$?.closed === false && this.genres$.unsubscribe();
  }

  /** Carga del catálogo. */
  ngOnInit(): void {
    this.genres$?.closed === false && this.genres$.unsubscribe();

    this.genres$ = this.api.findMediaByGenre(Media.parseGenreToNumber('all')).subscribe({
      next: data => this.medias = data,
      error: err => console.error(err)
    });
  }

  // *** EVENTOS ***
  /** Oculta o muestra el menú de categorías en dispositivos compatibles. */
  onCategoriesBtnClick = () => {
    if (this.categoriesContainerStatusClass === ' hide')
      return;

    this.categoriesContainerStatusClass = this.categoriesContainerStatusClass === ' idle'
      ? ' hide'
      : ' show';
  }

  /** Controlador de animaciones del menú de categorías. */
  onCategoriesContainerAnimationEnd() {
    if (this.categoriesContainerStatusClass === ' hide')
      this.categoriesContainerStatusClass = '';
    else if (this.categoriesContainerStatusClass === ' show')
      this.categoriesContainerStatusClass = ' idle';
  }

  /** Controlador de clics del menú de categorías. */
  onCategoriesContainerClick(e: MouseEvent) {
    const elem = e.target as Element;

    const btnElem = Array.from(this.categoriesButtonsContainer.nativeElement.children).find(b => {
      return elem === b || b.contains(elem);
    });

    if (!btnElem)
      return;

    const genre = btnElem.id.split('-')[0];

    this.genres$?.closed === false && this.genres$.unsubscribe();

    this.genres$ = this.api.findMediaByGenre(Media.parseGenreToNumber(genre)).subscribe({
      next: data => {
        this.medias = data;

        // Actualiza el parámetro del URL.
        this.router.navigate(['/', 'categorias'], {
          queryParams: { op: genre }, replaceUrl: true
        });
      },
      error: err => {
        this.medias = undefined;
        console.error(err);
      }
    });
  }

  /** Controlador de clics para tarjetas de películas y series. */
  onOptionsContainerClick(e: MouseEvent) {
    const elem = e.target as Element;

    if (!this.optionsContainer || this.optionsContainer.nativeElement === elem)
      return;

    const mediaItem = Array.from(this.optionsContainer.nativeElement.children).find(c => {
      return e.target === c || c.contains(e.target as Node)
    });

    if (!mediaItem)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id: mediaItem.children[0].id.split('-')[1] } });
  }

  // *** GET / SET ***
  /** Obtiene el catálogo de este componente. */
  getCatalogue() {
    return this.medias
  }

  /** Obtiene la clase de estado de 'categories-container' para el control de animaciones.*/
  getCategoriesContainerStatusClass() {
    return this.categoriesContainerStatusClass;
  }

  /** Obtiene la categorías seleccionada. */
  getCurrentCategory() {
    switch (this.op) {
      case 'action': return 'Acción';
      case 'comedy': return 'Comedia';
      case 'crime': return 'Crimen';
      case 'drama': return 'Drama';
      case 'sci_fi': return 'Ciencia ficción';
      default: return 'Todas';
    }
  }

  /** Asigna una categoría. */
  setCurrentCategory(category: string) {
    this.op = category;
  }
}
