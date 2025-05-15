import { Routes } from '@angular/router';
import { ShellComponentComponent } from './shell.component';

export const shellRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: ShellComponentComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@crafting-cart/catalog').then((component) => component.CatalogComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('@crafting-cart/shopping-list').then((component) => component.ShoppingListComponent)
      }
    ]
  }
];
