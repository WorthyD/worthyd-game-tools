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
        pathMatch: 'full',
        redirectTo: 'crafting-cart'
      },
      {
        path: 'crafting-cart',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@cozy-almanacs/crafting-cart/catalog').then((component) => component.CatalogComponent)
          },
          {
            path: 'list',
            loadComponent: () =>
              import('@cozy-almanacs/crafting-cart/shopping-list').then((component) => component.ShoppingListComponent)
          },
          {
            path: 'config',
            loadComponent: () =>
              import('@cozy-almanacs/crafting-cart/cart-item-config').then(
                (component) => component.CatalogEditorComponent
              )
          },
          {
            path: 'config/:datasetId',
            loadComponent: () =>
              import('@cozy-almanacs/crafting-cart/cart-item-config').then(
                (component) => component.CatalogEditorComponent
              )
          }
        ]
      }
    ]
  }
];
