import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cartAdapter } from './cart.reducer';
import { CART_FEATURE_KEY, CartState } from './cart.state';

// Lookup the 'Cart' feature state managed by NgRx
export const selectCartState = createFeatureSelector<CartState>(CART_FEATURE_KEY);

const { selectAll, selectEntities } = cartAdapter.getSelectors();

export const selectAllCart = createSelector(selectCartState, (state: CartState) => selectAll(state));

export const selectCartEntities = createSelector(selectCartState, (state: CartState) => selectEntities(state));
