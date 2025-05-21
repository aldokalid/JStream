import { Routes } from '@angular/router';
import { CategoriesComponent } from 'src/app/pages/categories/categories.component';
import { MediaComponent } from 'src/app/pages/media/media.component';
import { NotFoundComponent } from 'src/app/pages/not-found/not-found.component';
import { SearchComponent } from 'src/app/pages/search/search.component';
import { TendenciesComponent } from 'src/app/pages/tendencies/tendencies.component';

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