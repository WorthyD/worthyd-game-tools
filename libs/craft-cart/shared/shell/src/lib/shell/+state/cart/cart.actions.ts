import { createAction, props } from '@ngrx/store';
import { CartEntity } from './cart.models';

// export const initCart = createAction('[Cart Page] Init');

// export const loadCartSuccess = createAction('[Cart/API] Load Cart Success', props<{ cart: CartEntity[] }>());
// export const loadCartFailure = createAction('[Cart/API] Load Cart Failure', props<{ error: any }>());
const aKey = '[Cart]';

export const addItemToCart = createAction(`${aKey} - Add Item To Cart`, props<{ itemId: string; quantity: number }>());

export const removeItemsFromCart = createAction(
  `${aKey} - Remove Items From Cart`,
  props<{ itemId: string; quantity: number }>()
);

export const deleteItemFromCart = createAction(`${aKey} - Delete Item From Cart`, props<{ itemId: string }>());
