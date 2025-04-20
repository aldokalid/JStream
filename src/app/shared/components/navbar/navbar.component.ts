import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// @deprecated Aún hay eventos pendientes.

@Component({
  selector: 'app-navbar',
  standalone: true, // Angular 18.
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  /** Evento que se disparará al hacer clic sobre la imagen del usuario. */
  @Input() onUserImgClick!: () => void;

  constructor(private router: Router) { }

  // *** EVENTOS ***
  onCategoriesOptionClick() {
    // Omite la navegación si ya se está en la ubicación 'categorias'.
    if (/^\/categorias/.test(this.router.url))
      return;

    this.router.navigate(['/', 'categorias'], {
      queryParams: { 'op': 'all' }
    });
  }

  onLogoClick() {
    this.router.navigate(['/']);
  }

  onSearchBtnClick() {
    // Omite la navegación si ya se está en la ubicación 'buscar'.
    if (/^\/buscar/.test(this.router.url))
      return;

    this.router.navigate(['/', 'buscar']);
  }

  onUserPictureClick() {
    this.onUserImgClick();
  }
}
