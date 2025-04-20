import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { MediaItemComponent } from "../../shared/components/media-item/media-item.component";
import { DAOCatalogueService } from 'src/app/shared/services/daocatalogue.service';
import Media from 'src/app/models/media.model';

@Component({
  selector: 'app-tendencies',
  standalone: true, // (Requerido en Angular 18<).
  imports: [CarouselComponent, CommonModule, MediaItemComponent],
  templateUrl: './tendencies.component.html',
  styleUrl: './tendencies.component.scss'
})
export class TendenciesComponent {
  @ViewChild('tendenciesHolder') private tendenciesHolder?: ElementRef<HTMLDivElement>;
  // Debe estar definido aquí. No se puede obtener desde el DAO porque el carrusel entra en bucle.
  private tendencyCatalog: Media[];

  constructor(private router: Router, private daoCatalogue: DAOCatalogueService) {
    this.tendencyCatalog = daoCatalogue.getTendencies();
  }

  // *** EVENTOS ***
  /** Controlador de clics para el contenedor de tendencias. */
  onTendenciesClick(e: MouseEvent) {
    if (!this.tendenciesHolder || this.tendenciesHolder.nativeElement === e.target)
      return;

    const mediaItem = Array.from(this.tendenciesHolder.nativeElement.children).find(c => {
      return e.target === c || c.contains(e.target as Node)
    });

    if (!mediaItem)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id: mediaItem.children[0].id.split('-')[1] } });
  }

  // *** GET / SET ***
  /** Obtiene todo el catálogo. */
  getCatalogue() {
    return this.daoCatalogue.getCatalogue();
  }

  /** Obtiene el contenido del catálogo que es tendencia. */
  getTendencies() {
    return this.tendencyCatalog;
  }
}
