import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';

@Injectable()
export class CartFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  allCart$ = this.store.pipe(select(CartSelectors.selectAllCart));

  addItemToCart({ itemId, quantity }: { itemId: string; quantity: number }) {
    this.store.dispatch(CartActions.addItemToCart({ itemId, quantity }));
  }

  removeItemsFromCart({ itemId, quantity }: { itemId: string; quantity: number }) {
    this.store.dispatch(CartActions.removeItemsFromCart({ itemId, quantity }));
  }

  deleteItemFromCart({ itemId }: { itemId: string }) {
    this.store.dispatch(CartActions.deleteItemFromCart({ itemId }));
  }

  emptyCart() {
    this.store.dispatch(CartActions.emptyCart());
  }
}
