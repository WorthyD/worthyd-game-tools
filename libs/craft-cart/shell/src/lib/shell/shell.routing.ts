import { Routes } from '@angular/router';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromCatalog from './+state/catalog.reducer';
import { CatalogEffects } from './+state/catalog.effects';
import { CatalogFacade } from './+state/catalog.facade';

export const shellRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('@crafting-cart/catalog').then((module) => module.CatalogComponent),
    providers: [

    ]
  }
];
