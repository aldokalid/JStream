import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true, // (Requerido en Angular 18<).
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private router: Router) { }

  /** Controladod de clics para el botón 'Ir a inicio'. */
  onGoToHomeBtnClick() {
    this.router.navigate(['/'], { replaceUrl: true })
  }
}
