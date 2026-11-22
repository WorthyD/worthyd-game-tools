import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { Bundle, BundleItem, CatalogDataset, Item } from '@cozy-almanacs/models';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';
import { CatalogStore } from '../catalog/catalog.store';
import { createBundlesFile } from '../catalog-editor/catalog-files';
import { hashString, itemFromUrl, toCatalogId } from '../catalog-editor/catalog-editor.utils';
import {
  BundlePath,
  bundleAt,
  bundleItemKey,
  compactBundle,
  compactBundleItem,
  flattenBundles,
  moveEntry,
  updateBundleAt,
  updateSiblings
} from './bundle.utils';

export const BUNDLE_EDITOR_STORAGE_KEY = 'bundle-editor';

export const bundleEditorStorageKey = (datasetId: string): string => `${BUNDLE_EDITOR_STORAGE_KEY}.${datasetId}`;

/** What the bundle editor keeps in local storage for each dataset. */
export interface PersistedBundleDraft {
  bundles: Bundle[];
  /** Fingerprint of the source file the draft started from. */
  sourceHash: string;
  savedAt: string;
}

export interface BundleEditorState {
  datasetId: string | null;
  datasetName: string;
  filePath: string | null;
  source: Bundle[] | null;
  sourceHash: string;
  draft: Bundle[] | null;
  savedAt: string | null;
  /** The draft came from local storage rather than the source file. */
  restored: boolean;
  /** The source file changed after the restored draft was started. */
  sourceChanged: boolean;
}

const initialBundleEditorState: BundleEditorState = {
  datasetId: null,
  datasetName: '',
  filePath: null,
  source: null,
  sourceHash: '',
  draft: null,
  savedAt: null,
  restored: false,
  sourceChanged: false
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const duplicates = (ids: string[]): string[] =>
  [...new Set(ids.filter((id, index) => id && ids.indexOf(id) !== index))].sort();

/** `base`, or `base_2`, `base_3`… whichever isn't taken. */
const uniqueId = (base: string, taken: Set<string>): string => {
  let id = base;
  for (let n = 2; taken.has(id); n++) {
    id = `${base}_${n}`;
  }
  return id;
};

/**
 * Draft state for the bundle editor, autosaved to local storage per dataset like the catalog editor.
 * "Saving" is manual: copy `bundlesFile()` over the dataset's bundles.ts.
 * Bundles are addressed by their `BundlePath` in the nested list.
 *
 * Provide it on the editor component, not in root, so each visit starts from `open()`.
 */
export const BundleEditorStore = signalStore(
  withState(initialBundleEditorState),
  withProps(() => ({ _catalog: inject(CatalogStore), _localStorage: inject(LocalStorageService) })),
  withComputed(({ source, draft, _catalog }) => ({
    dirty: computed(() => !!draft() && JSON.stringify(draft()) !== JSON.stringify(source())),
    bundlesFile: computed(() => createBundlesFile(draft() ?? [])),
    /** Problems that would break the bundles once the file is replaced. */
    issues: computed(() => {
      const bundles = flattenBundles(draft() ?? []);
      const issues: string[] = [];
      const itemIds = new Set(_catalog.ids() as string[]);
      const categories = new Set(_catalog.categories().map(({ id }) => id));
      const tags = new Set(_catalog.tags().map(({ id }) => id));

      if (bundles.some(({ id }) => !id)) {
        issues.push('Some bundles have no id.');
      }
      const duplicateBundles = duplicates(bundles.map(({ id }) => id));
      if (duplicateBundles.length) {
        issues.push(`Duplicate bundle ids: ${duplicateBundles.join(', ')}`);
      }
      for (const bundle of bundles) {
        const items = bundle.items ?? [];
        const name = bundle.name || bundle.id || 'A bundle';
        if (items.some((item) => !bundleItemKey(item))) {
          issues.push(`${name} has items with no catalog item or id.`);
        }
        if (items.some((item) => !item.itemId && !item.name)) {
          issues.push(`${name} has one-off items with no name.`);
        }
        const duplicateItems = duplicates(items.map(bundleItemKey));
        if (duplicateItems.length) {
          issues.push(`${name} lists these more than once (give repeats their own id): ${duplicateItems.join(', ')}`);
        }
        const missing = items.filter((item) => item.itemId && !itemIds.has(item.itemId)).map((item) => item.itemId);
        if (missing.length && itemIds.size) {
          issues.push(`${name} uses items that aren't in the catalog: ${missing.join(', ')}`);
        }
        const unknownLabels = [
          ...(bundle.itemFilter?.categories ?? []).filter((id) => !categories.has(id)),
          ...(bundle.itemFilter?.tags ?? []).filter((id) => !tags.has(id))
        ];
        if (unknownLabels.length) {
          issues.push(`${name} filters on labels that aren't defined: ${unknownLabels.join(', ')}`);
        }
      }
      return issues;
    })
  })),
  withMethods((store) => {
    /** Applies a change to the draft and autosaves it (or clears the saved draft when it matches the source again). */
    const updateDraft = (change: (bundles: Bundle[]) => Bundle[]): void => {
      const draft = store.draft();
      const datasetId = store.datasetId();
      if (!draft || !datasetId) {
        return;
      }
      const next = change(draft);
      const key = bundleEditorStorageKey(datasetId);
      if (JSON.stringify(next) === JSON.stringify(store.source())) {
        store._localStorage.removeItem(key);
        patchState(store, { draft: next, savedAt: null, restored: false, sourceChanged: false });
        return;
      }
      const savedAt = new Date().toISOString();
      const persisted: PersistedBundleDraft = { bundles: next, sourceHash: store.sourceHash(), savedAt };
      store._localStorage.setItem(key, persisted);
      patchState(store, { draft: next, savedAt });
    };

    const updateBundle = (path: BundlePath, change: (bundle: Bundle) => Bundle): void =>
      updateDraft((bundles) => updateBundleAt(bundles, path, (bundle) => compactBundle(change(bundle))));

    const updateItems = (path: BundlePath, change: (items: BundleItem[]) => BundleItem[]): void =>
      updateBundle(path, (bundle) => ({ ...bundle, items: change(bundle.items ?? []).map(compactBundleItem) }));

    const takenIds = (): Set<string> => new Set(flattenBundles(store.draft() ?? []).map(({ id }) => id));

    const copyWithNewIds = (bundle: Bundle, taken: Set<string>): Bundle => {
      const id = uniqueId(`${bundle.id}_copy`, taken);
      taken.add(id);
      const children = (bundle.bundles ?? []).map((child) => copyWithNewIds(child, taken));
      return compactBundle({ ...clone(bundle), id, name: `${bundle.name} (copy)`, bundles: children });
    };

    return {
      /** Loads a dataset's bundles, restoring its autosaved draft when there is one. */
      open(dataset: CatalogDataset): void {
        const source = clone(dataset.bundles ?? []);
        const sourceHash = hashString(JSON.stringify(source));
        const saved = store._localStorage.getItem<PersistedBundleDraft>(bundleEditorStorageKey(dataset.id));
        const restored = Array.isArray(saved?.bundles);
        patchState(store, {
          datasetId: dataset.id,
          datasetName: dataset.name,
          filePath: dataset.files?.bundles ?? null,
          source,
          sourceHash,
          draft: restored ? saved.bundles : clone(source),
          savedAt: restored ? saved.savedAt : null,
          restored,
          sourceChanged: restored && saved.sourceHash !== sourceHash
        });
      },

      /** Throws the draft away and starts again from the source file. */
      discardDraft(): void {
        const datasetId = store.datasetId();
        if (datasetId) {
          store._localStorage.removeItem(bundleEditorStorageKey(datasetId));
        }
        patchState(store, { draft: clone(store.source()), savedAt: null, restored: false, sourceChanged: false });
      },

      /** Adds a bundle at the end of `parent`'s children (or the top level) and returns its path. */
      addBundle(parent: BundlePath | null, name = 'New Bundle'): BundlePath {
        const bundle: Bundle = { id: uniqueId(toCatalogId(name) || 'bundle', takenIds()), name };
        if (!parent) {
          updateDraft((bundles) => [...bundles, bundle]);
          return [(store.draft()?.length ?? 1) - 1];
        }
        updateBundle(parent, (current) => ({ ...current, bundles: [...(current.bundles ?? []), bundle] }));
        return [...parent, (bundleAt(store.draft() ?? [], parent)?.bundles?.length ?? 1) - 1];
      },

      /** Adds a full bundle, e.g. the template, renaming ids that are taken. Returns its path. */
      insertBundle(parent: BundlePath | null, bundle: Bundle): BundlePath {
        const taken = takenIds();
        const rename = (b: Bundle): Bundle => {
          const id = uniqueId(b.id || 'bundle', taken);
          taken.add(id);
          return compactBundle({ ...clone(b), id, bundles: (b.bundles ?? []).map(rename) });
        };
        const added = rename(bundle);
        if (!parent) {
          updateDraft((bundles) => [...bundles, added]);
          return [(store.draft()?.length ?? 1) - 1];
        }
        updateBundle(parent, (current) => ({ ...current, bundles: [...(current.bundles ?? []), added] }));
        return [...parent, (bundleAt(store.draft() ?? [], parent)?.bundles?.length ?? 1) - 1];
      },

      updateBundle(path: BundlePath, changes: Partial<Bundle>): void {
        updateBundle(path, (bundle) => ({ ...bundle, ...changes }));
      },

      /** Copies a bundle (and its children, with new ids) right after it. Returns the copy's path. */
      duplicateBundle(path: BundlePath): BundlePath {
        const original = bundleAt(store.draft() ?? [], path);
        if (!original) {
          return path;
        }
        const copy = copyWithNewIds(original, takenIds());
        updateDraft((bundles) =>
          updateSiblings(bundles, path, (siblings, index) => [
            ...siblings.slice(0, index + 1),
            copy,
            ...siblings.slice(index + 1)
          ])
        );
        return [...path.slice(0, -1), path[path.length - 1] + 1];
      },

      removeBundle(path: BundlePath): void {
        updateDraft((bundles) =>
          updateSiblings(bundles, path, (siblings, index) => siblings.filter((_, i) => i !== index))
        );
      },

      /** Moves a bundle up or down among its siblings and returns its new path. */
      moveBundle(path: BundlePath, offset: -1 | 1): BundlePath {
        const before = JSON.stringify(store.draft());
        updateDraft((bundles) =>
          updateSiblings(bundles, path, (siblings, index) => moveEntry(siblings, index, offset))
        );
        return before === JSON.stringify(store.draft()) ? path : [...path.slice(0, -1), path[path.length - 1] + offset];
      },

      addItems(path: BundlePath, items: BundleItem[]): void {
        updateItems(path, (list) => [...list, ...items]);
      },

      /**
       * Adds an item for each pasted wiki url: the catalog item when its id is in the catalog, otherwise a
       * one-off with the name, image and link worked out from the url. Returns how many were added.
       */
      addItemsFromUrls(path: BundlePath, urls: string[]): number {
        const catalogIds = new Set(store._catalog.ids() as string[]);
        const existing = new Set((bundleAt(store.draft() ?? [], path)?.items ?? []).map(bundleItemKey));
        const added = urls
          .map(itemFromUrl)
          .filter((item): item is Item => !!item && !existing.has(item.id) && !!existing.add(item.id))
          .map(
            ({ id, name, imageUrl, links }): BundleItem =>
              catalogIds.has(id) ? { itemId: id } : { id, name, imageUrl, links }
          );
        if (added.length) {
          updateItems(path, (list) => [...list, ...added]);
        }
        return added.length;
      },

      updateItem(path: BundlePath, index: number, changes: Partial<BundleItem>): void {
        updateItems(path, (list) => list.map((item, i) => (i === index ? { ...item, ...changes } : item)));
      },

      removeItem(path: BundlePath, index: number): void {
        updateItems(path, (list) => list.filter((_, i) => i !== index));
      },

      moveItem(path: BundlePath, index: number, offset: -1 | 1): void {
        updateItems(path, (list) => moveEntry(list, index, offset));
      }
    };
  })
);

export type BundleEditorStore = InstanceType<typeof BundleEditorStore>;
