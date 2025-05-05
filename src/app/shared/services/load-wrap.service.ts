import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadWrapService {
  private loadWrapOnHide?: () => void;

  constructor() { }

  setLoadWrapOnHide(fn?: () => void) {
    this.loadWrapOnHide = fn;
  }

  loadWrapOnHideExecute() {
    if (this.loadWrapOnHide)
      this.loadWrapOnHide();
  }
}
