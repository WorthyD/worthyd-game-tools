import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as CartActions from './cart.actions';
import { CartEntity } from './cart.models';
import { CartState } from './cart.state';

export const cartAdapter: EntityAdapter<CartEntity> = createEntityAdapter<CartEntity>({
  selectId: (cart) => cart.itemId
});

export const initialCartState: CartState = cartAdapter.getInitialState({});

const reducer = createReducer(
  initialCartState,
  on(CartActions.addItemToCart, (state, { itemId, quantity }) => {
    const currentItem = state.entities[itemId];
    if (currentItem) {
      return cartAdapter.upsertOne({ itemId, quantity: currentItem.quantity + quantity }, state);
    }

    return cartAdapter.addOne({ itemId, quantity }, state);
  }),
  on(CartActions.removeItemsFromCart, (state, { itemId, quantity }) => {
    const currentItem = state.entities[itemId];
    if (currentItem && currentItem.quantity - quantity > 0) {
      return cartAdapter.upsertOne({ itemId, quantity: currentItem.quantity - quantity }, state);
    }

    return cartAdapter.removeOne(itemId, state);
  }),
  on(CartActions.deleteItemFromCart, (state, { itemId }) => cartAdapter.removeOne(itemId, state))
);

export function cartReducer(state: CartState | undefined, action: Action) {
  return reducer(state, action);
}
