import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { MediaItemComponent } from "../../shared/components/media-item/media-item.component";
import { APIService } from '@core/services/api.service';
import Media from 'src/app/models/media.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tendencies',
  standalone: true, // (Requerido en Angular 18<).
  imports: [CarouselComponent, CommonModule, MediaItemComponent],
  templateUrl: './tendencies.component.html',
  styleUrl: './tendencies.component.scss'
})
export class TendenciesComponent implements OnDestroy, OnInit {
  @ViewChild('tendenciesHolder') tendenciesHolder!: ElementRef<HTMLDivElement>;
  // Debe estar definido aquí. No se puede obtener desde el DAO porque el carrusel entra en bucle.
  private tendencyCatalog: Media[] = [];
  private tendencies$!: Subscription;

  constructor(private router: Router, private api: APIService) { }

  // *** ANGULAR ***
  ngOnDestroy(): void {
    this.tendencies$?.unsubscribe();
  }

  ngOnInit(): void {
    this.tendencies$ = this.api.getMedias$().subscribe({
      next: data => {
        this.tendencyCatalog = data.filter(d => d.getIsTendency());
      },
      error: err => {
        console.error(err);
      }
    });
  }

  // *** EVENTOS ***
  /** Controlador de clics para el contenedor de tendencias. */
  onTendenciesClick(e: MouseEvent) {
    const elem = e.target as Element;

    if (this.tendenciesHolder.nativeElement === elem)
      return;

    const mediaItem = Array.from(this.tendenciesHolder.nativeElement.children).find(c => {
      return elem === c || c.contains(elem as Node)
    });

    if (!mediaItem)
      return;

    this.router.navigate(['/', 'medio'], { queryParams: { id: mediaItem.children[0].id.split('-')[1] } });
  }

  /** Obtiene el contenido del catálogo que es tendencia. */
  getTendencies() {
    return this.tendencyCatalog;
  }
}
