import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromCatalog from './+state/catalog.reducer';
import { CatalogEffects } from './+state/catalog.effects';
import { CatalogFacade } from './+state/catalog.facade';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

export const shellProviders = [
  provideStore(),
  //provideEffects(),
  CatalogFacade,
  provideState(fromCatalog.CATALOG_FEATURE_KEY, fromCatalog.catalogReducer),
  //provideEffects(CatalogEffects)
  provideStoreDevtools({
    maxAge: 25, // Retains last 25 states
    logOnly: !isDevMode(), // Restrict extension to log-only mode
    autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
    traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    connectInZone: true // If set to true, the connection is established within the Angular zone
  })
];
