import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Media from 'src/app/models/media.model';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { APIService } from '@core/services/api.service';
import { InputbarComponent } from "../../shared/components/generic/input-bar/inputbar.component";
import { ButtonComponent } from "../../shared/components/generic/button/button.component";

@Component({
  selector: 'app-search',
  standalone: true, // (Requerido en Angular 18<).
  imports: [MediaItemComponent, NgFor, NgIf, InputbarComponent, ButtonComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnDestroy {
  @ViewChild('itemsContainer') itemsContainer!: ElementRef<HTMLDivElement>;
  private mediaItems?: Media[];
  private medias$?: Subscription;
  private state: { searchInputbarValue?: string } = {};

  constructor(private api: APIService, private router: Router) { }

  // *** ANGULAR ***
  ngOnDestroy(): void {
    this.medias$?.closed === false && this.medias$.unsubscribe();
  }

  // *** EVENTOS ***
  /** Controlador de clics para el botón de búsqueda. */
  onSearchBtnClick = () => {
    const value = this.state.searchInputbarValue;

    if (!value)
      this.mediaItems = undefined;
    else { // Busca coinciencias en el título.
      this.mediaItems = [new Media(0, '', '', '', '', false, new Date(), '', 'movie')];
      this.medias$?.closed === false && this.medias$.unsubscribe();

      this.medias$ = this.api.findMediaByTitle$(value?.replace(/\s+/g, ' ')).subscribe({
        next: data => this.mediaItems = data,
        error: err => {
          console.error(err);
          this.mediaItems = undefined;
        }
      });
    }
  }

  onSearchInputbarChange = (input?: string) => {
    this.state.searchInputbarValue = input?.trim().replace(/\s+/g, '');
  }

  /** Controlador de clics del contenedor de resultados. */
  onSearchItemsContainerClick(e: MouseEvent) {
    if (!this.mediaItems || this.mediaItems.length === 0)
      return;

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

  // *** GENÉRICOS ***
  /** Verifica si se está haciendo una búsqueda. */
  isWaitingResponse() {
    return this.mediaItems?.length === 1 && this.mediaItems[0].getId() === 0;
  }

  // *** GET / SET
  /** Obtiene los resultados de la búsqueda actual. */
  getMediaItems() {
    return this.mediaItems;
  }
}
