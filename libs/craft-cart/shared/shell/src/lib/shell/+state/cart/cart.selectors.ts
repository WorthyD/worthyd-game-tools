import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CART_FEATURE_KEY, CartState, cartAdapter } from './cart.reducer';

// Lookup the 'Cart' feature state managed by NgRx
export const selectCartState = createFeatureSelector<CartState>(CART_FEATURE_KEY);

const { selectAll, selectEntities } = cartAdapter.getSelectors();

export const selectCartLoaded = createSelector(selectCartState, (state: CartState) => state.loaded);

export const selectCartError = createSelector(selectCartState, (state: CartState) => state.error);

export const selectAllCart = createSelector(selectCartState, (state: CartState) => selectAll(state));

export const selectCartEntities = createSelector(selectCartState, (state: CartState) => selectEntities(state));

export const selectSelectedId = createSelector(selectCartState, (state: CartState) => state.selectedId);

export const selectEntity = createSelector(selectCartEntities, selectSelectedId, (entities, selectedId) =>
  selectedId ? entities[selectedId] : undefined
);
