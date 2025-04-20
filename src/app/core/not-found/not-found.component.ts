import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true, // Angular 18.
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private _router: Router) { }

  onGoToHomeBtnClick() {
    this._router.navigate(['/'], { replaceUrl: true })
  }
}
