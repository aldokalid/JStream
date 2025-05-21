import { Inject, Injectable } from '@angular/core';
import { WINDOW } from './window.token';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(@Inject(WINDOW) private wdw?: Window) { }

  /** Recarga la página. */
  reloadPage() {
    if (this.wdw)
      this.wdw.location.reload();
    else
      window.location.reload();
  }
}
