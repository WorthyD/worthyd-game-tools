import { computed, inject } from '@angular/core';
import { patchState, signalStore, type, watchState, withComputed, withHooks, withMethods } from '@ngrx/signals';
import {
  entityConfig,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities
} from '@ngrx/signals/entities';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';
import { CartEntity, PersistedCart } from './cart.models';

export const CART_STORAGE_KEY = 'cart';

const cartConfig = entityConfig({
  entity: type<CartEntity>(),
  selectId: (cartItem) => cartItem.itemId
});

export const CartStore = signalStore(
  { providedIn: 'root' },
  withEntities(cartConfig),
  withComputed(({ entities }) => ({
    cartCount: computed(() => entities().length)
  })),
  withMethods((store) => ({
    addItemToCart({ itemId, quantity }: CartEntity): void {
      const currentQuantity = store.entityMap()[itemId]?.quantity ?? 0;
      patchState(store, setEntity({ itemId, quantity: currentQuantity + quantity }, cartConfig));
    },
    updateItemsInCart({ itemId, quantity }: CartEntity): void {
      patchState(store, setEntity({ itemId, quantity }, cartConfig));
    },
    removeItemsFromCart({ itemId, quantity }: CartEntity): void {
      const remaining = (store.entityMap()[itemId]?.quantity ?? 0) - quantity;
      if (remaining > 0) {
        patchState(store, setEntity({ itemId, quantity: remaining }, cartConfig));
        return;
      }
      patchState(store, removeEntity(itemId));
    },
    deleteItemFromCart({ itemId }: { itemId: string }): void {
      patchState(store, removeEntity(itemId));
    },
    emptyCart(): void {
      patchState(store, removeAllEntities());
    }
  })),
  withHooks((store, localStorageService = inject(LocalStorageService)) => ({
    onInit() {
      // Saved in the classic NgRx entity shape ({ ids, entities }) so existing carts keep loading.
      const saved = localStorageService.getItem<PersistedCart>(CART_STORAGE_KEY);
      if (saved?.ids && saved.entities) {
        const items = saved.ids.map((id) => saved.entities[id]).filter((item): item is CartEntity => !!item);
        patchState(store, setAllEntities(items, cartConfig));
      }

      watchState(store, () => {
        const persisted: PersistedCart = { ids: store.ids() as string[], entities: store.entityMap() };
        localStorageService.setItem(CART_STORAGE_KEY, persisted);
      });
    }
  }))
);

export type CartStore = InstanceType<typeof CartStore>;
