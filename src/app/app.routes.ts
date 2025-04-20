import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { HomeRoutes } from '@core/home/home.routes';

// Este arreglo guarda todas las rutas.
export const routes: Routes = [
  {
    path: '', // La cadena vacía hace referencia a la ruta raíz.
    component: HomeComponent,
    children: HomeRoutes // Este es clave para que las rutas secundarias del componente Home funcionen.
  }
];
