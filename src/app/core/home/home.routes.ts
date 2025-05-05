import { Routes } from '@angular/router';
import { CategoriesComponent } from '@core/categories/categories.component';
import { MediaComponent } from '@core/media/media.component';
import { NotFoundComponent } from '@core/not-found/not-found.component';
import { SearchComponent } from '@core/search/search.component';
import { TendenciesComponent } from '@core/tendencies/tendencies.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: TendenciesComponent,
  },
  {
    path: 'categorias',
    component: CategoriesComponent
  },
  {
    path: 'medio',
    component: MediaComponent,
  },
  {
    path: 'buscar',
    component: SearchComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];