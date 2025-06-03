import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../generic/button/button.component";

// @deprecated Aún hay eventos pendientes.

@Component({
  selector: 'app-navbar',
  standalone: true, // (Requerido en Angular 18<).
  imports: [ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  /** Evento que se disparará al hacer clic sobre la imagen del usuario. */
  @Input({ required: true }) onUserImgClick!: () => void;

  constructor(private router: Router) { }

  // *** EVENTOS ***
  /** Controlador de clics para la opción Categorías. */
  onCategoriesOptionClick() {
    // Omite la navegación si ya se está en la ubicación 'categorias'.
    if (/^\/categorias/.test(this.router.url))
      return;

    this.router.navigate(['/', 'categorias'], {
      queryParams: { 'op': 'all' }
    });
  }

  /** Controlador de clics para el logo. */
  onLogoClick() {
    this.router.navigate(['/']);
  }

  /** Controlador de clics para el botón de búsqueda. */
  onSearchBtnClick() {
    // Omite la navegación si ya se está en la ubicación 'buscar'.
    if (!/^\/buscar/.test(this.router.url))
      this.router.navigate(['/', 'buscar']);
  }

  /** Controlador de clis para la imagen del usuario. */
  onUserPictureClick() {
    this.onUserImgClick();
  }
}
