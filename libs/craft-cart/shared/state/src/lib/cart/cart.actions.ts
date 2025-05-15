import { createAction, props } from '@ngrx/store';

const aKey = '[Cart]';

export const addItemToCart = createAction(`${aKey} - Add Item To Cart`, props<{ itemId: string; quantity: number }>());

export const removeItemsFromCart = createAction(
  `${aKey} - Remove Items From Cart`,
  props<{ itemId: string; quantity: number }>()
);

export const deleteItemFromCart = createAction(`${aKey} - Delete Item From Cart`, props<{ itemId: string }>());
export const emptyCart = createAction(`${aKey} - Empty Cart`);
