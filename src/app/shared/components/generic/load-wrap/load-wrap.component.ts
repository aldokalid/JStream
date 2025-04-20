import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CallbackAssignerObject } from 'src/app/models/callback-assigner.model';

@Component({
  selector: 'app-load-wrap',
  standalone: true, // Angular 18.
  imports: [],
  templateUrl: './load-wrap.component.html',
  styleUrl: './load-wrap.component.scss'
})
export class LoadWrapComponent implements OnInit {
  /** Un objeto de asignación de función. Al ejecutarlo, el componente se esconderá y, finalmente,
   * llamará a 'onDispose'. */
  @Input() disposeComponent!: CallbackAssignerObject;
  /** Una función que se activará cuando el componente se haya ocultado del DOM. */
  @Input() onDispose!: () => void;
  /** Una función para ocultar el componente. */
  @Input() onHide!: () => void;
  /** Referencia a la cortina del componente. */
  @ViewChild('loadingWrapper') loadingWrapper!: ElementRef;

  private _statusClass: ' show' | ' hide' | '' = ' show';

  // *** EVENTOS ***
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
  getStatusClass() {
    return this._statusClass
  }

  // *** ANGULAR ***
  ngOnInit(): void {
    // Asigna la función de ejecución al objeto recibido.
    this.disposeComponent.executer = () => this._statusClass = ' hide';
  }
}
