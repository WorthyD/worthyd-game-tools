import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as CatalogActions from './catalog.actions';
import * as CatalogFeature from './catalog.reducer';
import * as CatalogSelectors from './catalog.selectors';

@Injectable()
export class CatalogFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(CatalogSelectors.selectCatalogLoaded));
  allCatalog$ = this.store.pipe(select(CatalogSelectors.selectAllCatalog));
  selectedCatalog$ = this.store.pipe(select(CatalogSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(CatalogActions.initCatalog());
  }
}
