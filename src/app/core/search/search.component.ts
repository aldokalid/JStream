import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Media from 'src/app/models/media.model';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';

@Component({
  selector: 'app-search',
  standalone: true, // (Requerido en Angular 18<).
  imports: [MediaItemComponent, NgFor, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @ViewChild('itemsContainer') itemsContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private mediaItems?: Media[];
  private media$!: Subscription;

  constructor(private daoCatalogue: DAOCatalogueService, private router: Router) { }

  // *** EVENTOS ***
  /** Controlador de clics para el botón de búsqueda. */
  onSearchBtnClick() {
    // Obtiene la entrada e la barra de texto.
    const { value } = this.searchInput.nativeElement;

    if (!value)
      this.mediaItems = undefined;
    else { // Busca coinciencias en el título.
      this.media$ = this.daoCatalogue.catalogue$.subscribe({
        next: data => {
          this.mediaItems = data
            .filter(d => d.getTitle().toLowerCase().includes(value.toLowerCase().replace(/\s+/, ' ')))
        }
      });

      this.media$.unsubscribe();
    }
  }

  /** Controlador de clics del contenedor de resultados. */
  onSearchItemsContainerClick(e: MouseEvent) {
    const elem = (e.target as HTMLElement);

    if (elem === this.itemsContainer.nativeElement)
      return;

    const mediaItem = Array.from(this.itemsContainer.nativeElement.children).find(c => {
      return e.target === c || c.contains(e.target as Node)
    });

    if (!mediaItem)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id: mediaItem.children[0].id.split('-')[1] } });
  }

  // *** GET / SET
  /** Obtiene los resultados de la búsqueda actual. */
  getMediaItems() {
    return this.mediaItems;
  }
}
