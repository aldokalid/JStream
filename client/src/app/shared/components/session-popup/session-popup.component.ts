import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BrowserService } from '../../services/browser.service';
import { ButtonComponent } from "../generic/button/button.component";
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-session-popup',
  standalone: true, // (Requerido en Angular 18<).
  imports: [ButtonComponent],
  templateUrl: './session-popup.component.html',
  styleUrl: './session-popup.component.scss'
})
export class SessionPopupComponent implements OnDestroy, OnInit {
  /** Referencia al componente padre (para detectar clics fuera de este componente). */
  @Input({ required: true }) parentComponent!: ElementRef<HTMLDivElement>;
  /** Función que se activará cuando el componente se haya ocultado del DOM. */
  @Input({ required: true }) onDispose!: () => void;
  /** Referencia a este componente. */
  @ViewChild('sessionPopup') sessionPopup!: ElementRef<HTMLDivElement>;

  private _session?: string;
  private currSession!: string;
  private statusClass: ' show' | ' hide' | '' = ' show';

  constructor(private browserService: BrowserService, private auth: AuthService) { }

  // *** ANGULAR ***
  ngOnDestroy(): void {
    // Elimina el evento de clic en el componente home.
    this.parentComponent?.nativeElement.removeEventListener('click', this.onHomeComponentClick);
  }

  ngOnInit(): void {
    this.currSession = this._session || 'Usuario';
    // Asigna un evento de clic en el componente home.
    this.parentComponent?.nativeElement.addEventListener('click', this.onHomeComponentClick);
  }

  // *** EVENTOS ***
  /** Utilizado para detectar clics fuera de este componente (se define aquí porque se requiere
   * para eliminar el evento una vez que ya no se requiera)
   * @deprecated La estructura actual no permite detectar clics en Navbar. Debe ubicarse en un servicio. */
  onHomeComponentClick = (e: MouseEvent) => {
    if (!this.sessionPopup.nativeElement.contains(e.target as Element)) {
      this.statusClass = ' hide';
    }
  }

  /** Controlador de fin de animación para el componente. */
  onComponentAnimationEnd() {
    if (this.statusClass === ' show')
      this.statusClass = '';
    else
      this.onDispose();
  }

  /** Controlador de clics para el botón Salir.
   * @deprecated Simulado. En el futuro, este metodo debe cerrar la sesión apropiadamente. */
  onLogoutBtnClick = () => {
    this.auth.isLogged$.subscribe({
      next: () => {
        if (this.browserService.reloadPage)
          this.browserService.reloadPage();
      }
    })

    this.auth.logout();
  }

  // *** GET / SET ***
  @Input({ required: true })
  set session(session: string) {
    this._session = session;
  }

  /** Obtiene la clase de estado del componente para el control de animaciones. */
  getStatusClass() {
    return this.statusClass;
  }

  /** Obtiene la sesión actual. */
  getCurrSession() {
    return this.currSession;
  }
}
