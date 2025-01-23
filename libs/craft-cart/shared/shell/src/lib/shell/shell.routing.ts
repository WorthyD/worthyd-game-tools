import { Routes } from '@angular/router';

export const shellRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@crafting-cart/catalog').then((component) => component.CatalogComponent),
    providers: []
  }
];
