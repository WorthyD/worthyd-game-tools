import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as CartActions from './cart.actions';
import * as CartFeature from './cart.reducer';
import * as CartSelectors from './cart.selectors';

@Injectable()
export class CartFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(CartSelectors.selectCartLoaded));
  allCart$ = this.store.pipe(select(CartSelectors.selectAllCart));
  selectedCart$ = this.store.pipe(select(CartSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    //this.store.dispatch(CartActions.initCart());
  }
}
