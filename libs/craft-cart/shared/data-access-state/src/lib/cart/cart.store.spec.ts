import { TestBed } from '@angular/core/testing';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CartStore } from './cart.store';

const PREFIX = 'CART-TEST-';

describe('CartStore', () => {
  const createStore = () => {
    TestBed.configureTestingModule({ providers: [getLocalStorageToken(PREFIX)] });
    return TestBed.inject(CartStore);
  };

  beforeEach(() => localStorage.clear());

  it('should add new item to cart', () => {
    const store = createStore();
    store.addItemToCart({ itemId: 'PRODUCT-BBB', quantity: 10 });

    expect(store.ids()).toEqual(['PRODUCT-BBB']);
    expect(store.cartCount()).toBe(1);
  });

  it('should add to the quantity of items already in cart', () => {
    const store = createStore();
    store.addItemToCart({ itemId: 'PRODUCT-BBB', quantity: 10 });
    store.addItemToCart({ itemId: 'PRODUCT-BBB', quantity: 10 });

    expect(store.ids().length).toBe(1);
    expect(store.entityMap()['PRODUCT-BBB']?.quantity).toBe(20);
  });

  it('should set the quantity on update', () => {
    const store = createStore();
    store.addItemToCart({ itemId: 'A', quantity: 10 });
    store.updateItemsInCart({ itemId: 'A', quantity: 3 });

    expect(store.entityMap()['A']?.quantity).toBe(3);
  });

  it('should reduce the quantity, and remove the item when none are left', () => {
    const store = createStore();
    store.addItemToCart({ itemId: 'A', quantity: 5 });

    store.removeItemsFromCart({ itemId: 'A', quantity: 2 });
    expect(store.entityMap()['A']?.quantity).toBe(3);

    store.removeItemsFromCart({ itemId: 'A', quantity: 3 });
    expect(store.entityMap()['A']).toBeUndefined();
  });

  it('should delete an item and empty the cart', () => {
    const store = createStore();
    store.addItemToCart({ itemId: 'A', quantity: 1 });
    store.addItemToCart({ itemId: 'B', quantity: 1 });

    store.deleteItemFromCart({ itemId: 'A' });
    expect(store.ids()).toEqual(['B']);

    store.emptyCart();
    expect(store.cartCount()).toBe(0);
  });

  it('should persist the cart to local storage in the { ids, entities } shape', () => {
    const store = createStore();
    store.addItemToCart({ itemId: 'A', quantity: 2 });
    TestBed.tick();

    expect(JSON.parse(localStorage.getItem(`${PREFIX}cart`) ?? '')).toEqual({
      ids: ['A'],
      entities: { A: { itemId: 'A', quantity: 2 } }
    });
  });

  it('should load a saved cart from local storage', () => {
    localStorage.setItem(
      `${PREFIX}cart`,
      JSON.stringify({
        ids: ['A', 'B'],
        entities: { A: { itemId: 'A', quantity: 2 }, B: { itemId: 'B', quantity: 4 } }
      })
    );

    const store = createStore();

    expect(store.ids()).toEqual(['A', 'B']);
    expect(store.entityMap()['B']?.quantity).toBe(4);
  });
});
