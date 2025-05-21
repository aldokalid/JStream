import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/components/generic/button/button.component";

@Component({
  selector: 'app-not-found',
  standalone: true, // (Requerido en Angular 18<).
  imports: [ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private router: Router) { }

  /** Controlador de clics para el botón 'Ir a inicio'. */
  onGoToHomeBtnClick = () => {
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
