import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CatalogDatasetLoader } from '@cozy-almanacs/state';
import { ShellComponentComponent } from './shell.component';

export const shellRoutes: Routes = [
  {
    path: '',
    providers: [],
    // Fetch the active dataset's JSON before the first page renders. If it fails the pages still open, empty.
    canActivate: [
      () =>
        inject(CatalogDatasetLoader)
          .loadActive()
          .then(() => true)
    ],
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
      },
      {
        path: 'bundles',
        children: [
          {
            path: '',
            loadComponent: () => import('@cozy-almanacs/bundles/tracker').then((m) => m.BundleTrackerComponent)
          },
          {
            path: 'config',
            loadComponent: () => import('@cozy-almanacs/bundles/config').then((m) => m.BundleEditorComponent)
          },
          {
            path: 'config/:datasetId',
            loadComponent: () => import('@cozy-almanacs/bundles/config').then((m) => m.BundleEditorComponent)
          },
          {
            path: ':bundleId',
            loadComponent: () => import('@cozy-almanacs/bundles/tracker').then((m) => m.BundleTrackerComponent)
          }
        ]
      }
    ]
  }
];
