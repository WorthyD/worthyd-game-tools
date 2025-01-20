import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromCatalog from './+state/catalog.reducer';
import { CatalogEffects } from './+state/catalog.effects';
import { CatalogFacade } from './+state/catalog.facade';


export const shellProviders = {
  providers: [
    provideStore(),
    provideEffects(),
    CatalogFacade,
    provideState(fromCatalog.CATALOG_FEATURE_KEY, fromCatalog.catalogReducer),
    provideEffects(CatalogEffects)
  ]
};
