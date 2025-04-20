import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Media from 'src/app/models/media.model';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';

@Component({
  selector: 'app-search',
  standalone: true, // Angular 18.
  imports: [MediaItemComponent, NgFor, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @ViewChild('itemsContainer') private itemsContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;
  private mediaItems?: Media[];

  constructor(private daoCatalogue: DAOCatalogueService, private router: Router) { }

  // *** EVENTS ***
  onSearchBtnClick() {
    const { value } = this.searchInput.nativeElement;

    if (!value)
      this.mediaItems = undefined;
    else
      this.mediaItems = this.daoCatalogue.searchCatalogue(value);
  }

  onSearchItemsContainerClick(e: MouseEvent) {
    if (!this.itemsContainer || this.itemsContainer.nativeElement === e.target)
      return;

    const mediaItem = Array.from(this.itemsContainer.nativeElement.children).find(c => {
      return e.target === c || c.contains(e.target as Node)
    });

    if (!mediaItem)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id: mediaItem.children[0].id.split('-')[1] } });
  }

  // *** GET / SET
  getMediaItems() {
    return this.mediaItems;
  }
}
