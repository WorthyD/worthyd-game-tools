import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Item, ItemCategory, ItemLabel, ItemTag } from '@cozy-almanacs/models';

export interface CatalogState {
  loaded: boolean;
  categories: ItemCategory[];
  tags: ItemTag[];
}

/** The config-level category and tag definitions that items refer to by id. */
export interface CatalogLabels {
  categories: ItemCategory[];
  tags: ItemTag[];
}

const initialCatalogState: CatalogState = {
  loaded: false,
  categories: [],
  tags: []
};

const toLabelMap = (labels: ItemLabel[]): Record<string, ItemLabel> =>
  Object.fromEntries(labels.map((label) => [label.id, label]));

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialCatalogState),
  withEntities<Item>(),
  withComputed(({ categories, tags }) => ({
    categoryMap: computed(() => toLabelMap(categories())),
    tagMap: computed(() => toLabelMap(tags()))
  })),
  withMethods((store) => ({
    init(catalog: Item[], labels: CatalogLabels = { categories: [], tags: [] }): void {
      patchState(store, setAllEntities(catalog), {
        loaded: true,
        categories: labels.categories,
        tags: labels.tags
      });
    }
  }))
);

export type CatalogStore = InstanceType<typeof CatalogStore>;
