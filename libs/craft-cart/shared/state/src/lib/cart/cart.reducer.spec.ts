import { Action } from '@ngrx/store';

import * as CartActions from './cart.actions';
import { CartEntity } from './cart.models';
import { initialCartState, cartReducer } from './cart.reducer';
import { CartState } from './cart.state';

describe('Cart Reducer', () => {
  const createCartEntity = (itemId: string, quantity: number): CartEntity => ({
    itemId,
    quantity
  });

  describe('valid Cart actions', () => {
    it('Should add new item to cart', () => {
      const action = CartActions.addItemToCart({ itemId: 'PRODUCT-BBB', quantity: 10 });
      const result: CartState = cartReducer(initialCartState, action);
      expect(result.ids.length).toBe(1);
    });
    it('Should update items already in cart', () => {
      const action = CartActions.addItemToCart({ itemId: 'PRODUCT-BBB', quantity: 10 });
      const result: CartState = cartReducer(initialCartState, action);

      const resultUpdated: CartState = cartReducer(result, action);

      expect(resultUpdated.ids.length).toBe(1);
      expect(resultUpdated.entities['PRODUCT-BBB']?.quantity).toBe(20);
    });

  });
});
