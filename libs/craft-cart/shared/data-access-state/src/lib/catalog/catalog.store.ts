import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Item } from '@crafting-cart/shared/models';

export interface CatalogState {
  loaded: boolean;
}

const initialCatalogState: CatalogState = {
  loaded: false
};

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialCatalogState),
  withEntities<Item>(),
  withMethods((store) => ({
    init(catalog: Item[]): void {
      patchState(store, setAllEntities(catalog), { loaded: true });
    }
  }))
);

export type CatalogStore = InstanceType<typeof CatalogStore>;
