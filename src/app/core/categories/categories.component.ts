import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import Media from 'src/app/models/media.model';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';

@Component({
  selector: 'app-categories',
  standalone: true, // (Requerido en Angular 18<).
  imports: [MediaItemComponent, NgFor, NgIf],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  /** La opción de categoría seleccionada (QueryParam). */
  @Input({ required: true }) private op: string = 'all';
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('optionsContainer') optionsContainer!: ElementRef<HTMLDivElement>;

  private catalogueSub$!: Subscription;
  private catalogue!: Media[];
  private categoriesContainerStatusClass: ' show' | ' hide' | ' idle' | '' = '';

  constructor(private daoCatalogue: DAOCatalogueService, private router: Router) { }

  // *** ANGULAR ***
  /** Carga del catálogo. */
  ngOnInit(): void {
    this.catalogueSub$ = this.daoCatalogue.catalogue$.subscribe({
      next: data => {
        this.catalogue = data;
      },
      error: err => {
        console.error(err);
      }
    });

    this.catalogueSub$.unsubscribe();
  }

  // *** EVENTOS ***
  /** Oculta o muestra el menú de categorías en dispositivos compatibles. */
  onCategoriesBtnClick() {
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

    if (elem.localName === 'button') {
      this.catalogueSub$ = this.daoCatalogue.catalogue$.subscribe({
        next: data => {
          this.catalogue = elem.id.includes('all')
            ? data
            : data.filter(d => d.getGenre().includes(elem.id.split('-')[0]));
        },
        error: err => {
          console.error(err);
        }
      });

      // Elimina la subscrición (@deprecated Esto no funcionará cuando el servicio sea asíncrono).
      this.catalogueSub$.unsubscribe();
      // Actualiza el parámetro del URL.
      this.router.navigate(['/', 'categorias'], {
        queryParams: { op: elem.id.split('-')[0] }, replaceUrl: true
      });
    }
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
    return this.catalogue
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
