import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-session-popup',
  standalone: true, // Angular 18.
  imports: [],
  templateUrl: './session-popup.component.html',
  styleUrl: './session-popup.component.scss'
})
export class SessionPopupComponent implements OnDestroy, OnInit {
  /** Referencia al componente padre (para detectar clics fuera de este componente). */
  @Input() parentComponent!: ElementRef<HTMLDivElement>;
  /** Función que se activará cuando el componente se haya ocultado del DOM. */
  @Input() onDispose!: () => void;
  /** Nombre de usuario mostrado en el componente. */
  @Input() session?: string;
  /** Referencia a este componente. */
  @ViewChild('sessionPopup') sessionPopup!: ElementRef<HTMLDivElement>;

  private currSession!: string;
  private _statusClass: ' show' | ' hide' | '' = ' show';
  
    // *** ANGULAR ***
    ngOnDestroy(): void {
      // Eliminando el evento de clic en el componente home.
      this.parentComponent.nativeElement.removeEventListener('click', this.onHomeComponentClick);
    }
  
    ngOnInit(): void {
      this.currSession = this.session || 'Usuario';
      // Asignando un evento de clic en el componente home.
      this.parentComponent.nativeElement.addEventListener('click', this.onHomeComponentClick)
    }

  // *** EVENTOS ***
  /** Utilizado para detectar clics fuera de este componente (se define aquí porque se requiere
   * para eliminar el evento una vez que ya no se requiera)
   * @deprecated La estructura actual no permite detectar clics en Navbar. El elemento padre
   * que se le debe pasar es AppComponent (para detectar la página entera al hacer clic) */
  private onHomeComponentClick = (e: MouseEvent) => {
    if (!this.sessionPopup.nativeElement.contains(e.target as Element)) {
      this._statusClass = ' hide';
    }
  }

  onComponentAnimationEnd() {
    if (this._statusClass === ' show')
      this._statusClass = '';
    else
      this.onDispose();
  }

  /** @deprecated Simulado. En el futuro, este metodo debe cerrar la sesión apropiadamente. */
  onLogoutBtnClick() {
    window.location.reload();
  }

  // *** GET / SET ***
  getStatusClass() {
    return this._statusClass;
  }

  getCurrSession() {
    return this.currSession;
  }
}
