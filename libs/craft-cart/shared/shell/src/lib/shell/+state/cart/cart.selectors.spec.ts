import { CartEntity } from './cart.models';
import { cartAdapter, CartPartialState, initialCartState } from './cart.reducer';
import * as CartSelectors from './cart.selectors';

describe('Cart Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getCartId = (it: CartEntity) => it.id;
  const createCartEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    }) as CartEntity;

  let state: CartPartialState;

  beforeEach(() => {
    state = {
      cart: cartAdapter.setAll(
        [createCartEntity('PRODUCT-AAA'), createCartEntity('PRODUCT-BBB'), createCartEntity('PRODUCT-CCC')],
        {
          ...initialCartState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('Cart Selectors', () => {
    it('selectAllCart() should return the list of Cart', () => {
      const results = CartSelectors.selectAllCart(state);
      const selId = getCartId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = CartSelectors.selectEntity(state) as CartEntity;
      const selId = getCartId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectCartLoaded() should return the current "loaded" status', () => {
      const result = CartSelectors.selectCartLoaded(state);

      expect(result).toBe(true);
    });

    it('selectCartError() should return the current "error" state', () => {
      const result = CartSelectors.selectCartError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
