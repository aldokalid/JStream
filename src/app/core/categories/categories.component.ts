import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() private op?: string; // Query Param.
  @ViewChild('categoriesContainer') private categoriesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('optionsContainer') private optionsContainer!: ElementRef<HTMLDivElement>;

  private catalogue?: Media[];
  private categoriesContainerStatusClass: ' show' | ' hide' | ' idle' | '' = '';

  constructor(private daoCatalogue: DAOCatalogueService, private router: Router) { }

  // *** ANGULAR ***
  /** Carga del catálogo. */
  ngOnInit(): void {
    this.catalogue = this.op === 'all'
      ? this.daoCatalogue.getCatalogue()
      : this.daoCatalogue.getCatalogueByGenre(this.op || '');
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
    const nE = this.categoriesContainer.nativeElement;

    if (nE === e.target || !nE.contains(e.target as Node))
      return;

    const elem = e.target as Element;

    if (elem.id.includes('all'))
      this.catalogue = this.daoCatalogue.getCatalogue();
    else
      this.catalogue = this.daoCatalogue.getCatalogueByGenre(elem.id.split('-')[0]);

    // Actualiza el parámetro del URL.
    this.router.navigate(['/', 'categorias'], {
      queryParams: { op: elem.id.split('-')[0] }, replaceUrl: true
    });
  }

  /** Controlador de clics para tarjetas de películas y series. */
  onOptionsContainerClick(e: MouseEvent) {
    if (!this.optionsContainer || this.optionsContainer.nativeElement === e.target)
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
    return this.catalogue;
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
}
