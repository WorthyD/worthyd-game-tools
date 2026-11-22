import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { Bundle, BundleItemProgress, BundleProgress } from '@cozy-almanacs/models';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';
import { CatalogStore } from '../catalog/catalog.store';
import { flattenBundles, resolveBundles } from './bundle.utils';

export const BUNDLE_PROGRESS_STORAGE_KEY = 'bundle-progress';

export const bundleProgressStorageKey = (datasetId: string): string => `${BUNDLE_PROGRESS_STORAGE_KEY}.${datasetId}`;

export interface BundleState {
  datasetId: string;
  bundles: Bundle[];
  progress: BundleProgress;
}

const initialBundleState: BundleState = {
  datasetId: '',
  bundles: [],
  progress: {}
};

/**
 * A game's bundles and the player's progress through them. Progress is saved to local storage per dataset.
 * Apps call `init()` with their dataset's bundles, the same way they load the `CatalogStore`.
 */
export const BundleStore = signalStore(
  { providedIn: 'root' },
  withState(initialBundleState),
  withProps(() => ({ _catalog: inject(CatalogStore), _localStorage: inject(LocalStorageService) })),
  withComputed(({ bundles, progress, _catalog }) => {
    const resolved = computed(() => resolveBundles(bundles(), _catalog.entities(), progress()));
    return {
      /** Bundles with their items filled in from the catalog and the saved progress. */
      resolved,
      /** Every bundle, nested ones included, by id. */
      resolvedMap: computed(() => new Map(flattenBundles(resolved()).map((bundle) => [bundle.id, bundle])))
    };
  }),
  withMethods((store) => {
    const save = (progress: BundleProgress): void => {
      patchState(store, { progress });
      if (store.datasetId()) {
        store._localStorage.setItem(bundleProgressStorageKey(store.datasetId()), progress);
      }
    };

    const update = (progressKey: string, change: (current: BundleItemProgress) => BundleItemProgress): void => {
      const next = change(store.progress()[progressKey] ?? {});
      const progress = { ...store.progress() };
      if (next.collected || next.turnedIn) {
        progress[progressKey] = next.turnedIn ? { collected: true, turnedIn: true } : { collected: true };
      } else {
        delete progress[progressKey];
      }
      save(progress);
    };

    return {
      /** Loads a dataset's bundles and its saved progress. */
      init(datasetId: string, bundles: Bundle[]): void {
        const saved = datasetId
          ? store._localStorage.getItem<BundleProgress>(bundleProgressStorageKey(datasetId))
          : null;
        patchState(store, {
          datasetId,
          bundles,
          progress: saved && typeof saved === 'object' ? saved : {}
        });
      },

      /** Marks an item collected or not. Un-collecting an item also un-turns it in. */
      setCollected(progressKey: string, collected: boolean): void {
        update(progressKey, (current) => ({ ...current, collected, turnedIn: collected && current.turnedIn }));
      },

      /** Marks an item turned in or not. Turning an item in also collects it. */
      setTurnedIn(progressKey: string, turnedIn: boolean): void {
        update(progressKey, (current) => ({ ...current, turnedIn, collected: turnedIn || current.collected }));
      },

      /** Clears the progress of a bundle and every bundle inside it. */
      resetBundle(bundleId: string): void {
        const bundle = store.resolvedMap().get(bundleId);
        if (!bundle) {
          return;
        }
        const keys = new Set(flattenBundles([bundle]).flatMap((b) => b.items.map((item) => item.progressKey)));
        save(Object.fromEntries(Object.entries(store.progress()).filter(([key]) => !keys.has(key))));
      }
    };
  })
);

export type BundleStore = InstanceType<typeof BundleStore>;
