import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoadWrapService } from 'src/app/shared/services/load-wrap.service';

@Component({
  selector: 'app-load-wrap',
  standalone: true, // (Requerido en Angular 18<).
  imports: [],
  templateUrl: './load-wrap.component.html',
  styleUrl: './load-wrap.component.scss'
})
export class LoadWrapComponent implements OnInit, OnDestroy {
  /** Una función que se activará cuando el componente se haya ocultado del DOM. */
  @Input({ required: true }) onDispose!: () => void;
  /** Referencia a la cortina del componente. */
  @ViewChild('loadingWrapper') loadingWrapper!: ElementRef<HTMLDivElement>;

  private _statusClass: ' show' | ' hide' | '' = ' show';

  constructor(private loadWrapService: LoadWrapService) { }

  // *** ANGULAR ***
  ngOnInit(): void {
    // Asigna la función de ejecución al objeto recibido.
    this.loadWrapService.setLoadWrapOnHide(() => this._statusClass = ' hide');
  }

  ngOnDestroy(): void {
    this.loadWrapService.setLoadWrapOnHide();
  }

  // *** EVENTOS ***
  /** Controlador de fin de animación para el componente. */
  onComponentAnimationEnd(e: AnimationEvent) {
    // Verifica que el elemento que lanzó el evento sea la cortina del componente.
    if (this.loadingWrapper.nativeElement !== e.target)
      return;

    if (this._statusClass === ' show')
      this._statusClass = '';
    else
      this.onDispose();
  }

  // *** GET / SET ***
  /** Obtiene la clase de estado del componente para el control de animaciones. */
  getStatusClass() {
    return this._statusClass
  }
}
