import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { MediaItemComponent } from "../../shared/components/media-item/media-item.component";
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';

@Component({
  selector: 'app-tendencies',
  standalone: true, // Angular 18.
  imports: [CarouselComponent, CommonModule, MediaItemComponent],
  templateUrl: './tendencies.component.html',
  styleUrl: './tendencies.component.scss'
})
export class TendenciesComponent {
  @ViewChild('tendenciesHolder') private _tendenciesHolder?: ElementRef<HTMLDivElement>;
  constructor(private _router: Router, private _daoCatalogue: DAOCatalogueService) { }

  // *** EVENTOS ***
  onTendenciesClick(e: MouseEvent) {
    if (!this._tendenciesHolder || this._tendenciesHolder.nativeElement === e.target)
      return;

    const mediaItem = Array.from(this._tendenciesHolder.nativeElement.children).find(c => {
      return e.target === c || c.contains(e.target as Node)
    });

    if (!mediaItem)
      return;

    this._router.navigate(['/', 'medio'], { queryParams: { id: mediaItem.children[0].id.split('-')[1] } });
  }

  // *** GET / SET ***
  /** Obtiene todo el contenido. */
  getCatalogue() {
    return this._daoCatalogue.getCatalogue();
  }

  /** Obtiene el contenido que es tendencia. */
  getTendencies() {
    return this._daoCatalogue.getTendencies() ?? [];
  }
}
