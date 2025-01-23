import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as CartActions from './cart.actions';
import { CartEffects } from './cart.effects';
import { CartFacade } from './cart.facade';
import { CartEntity } from './cart.models';
import { CART_FEATURE_KEY, CartState, initialCartState, cartReducer } from './cart.reducer';
import * as CartSelectors from './cart.selectors';

interface TestSchema {
  cart: CartState;
}

describe('CartFacade', () => {
  let facade: CartFacade;
  let store: Store<TestSchema>;
  const createCartEntity = (id: string, name = ''): CartEntity => ({
    id,
    name: name || `name-${id}`
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [StoreModule.forFeature(CART_FEATURE_KEY, cartReducer), EffectsModule.forFeature([CartEffects])],
        providers: [CartFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(CartFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allCart$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allCart$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadCartSuccess` to manually update list
     */
    it('allCart$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allCart$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        CartActions.loadCartSuccess({
          cart: [createCartEntity('AAA'), createCartEntity('BBB')]
        })
      );

      list = await readFirst(facade.allCart$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
