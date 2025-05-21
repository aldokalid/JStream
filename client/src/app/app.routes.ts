import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// Este arreglo guarda todas las rutas.
export const routes: Routes = [
  {
    path: '', // La cadena vacía hace referencia a la ruta raíz.
    component: HomeComponent,
    // Carga de componentes de Home en Lazy.
    loadChildren: () => import('./pages/home/home.routes').then(h => h.homeRoutes)
  }
];
