import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CatalogConfig, CatalogDataset, CatalogDatasetFiles, Item, ItemLabel } from '@cozy-almanacs/models';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';
import { createConfigFile, createItemsFile } from './catalog-files';
import { createEmptyItem, hashString, itemFromUrl, toCatalogId } from './catalog-editor.utils';

export const CATALOG_EDITOR_STORAGE_KEY = 'catalog-editor';

export type LabelKind = 'categories' | 'tags';

export interface CatalogDraft {
  config: CatalogConfig;
  items: Item[];
}

/** What the editor keeps in local storage for each dataset. */
export interface PersistedCatalogDraft extends CatalogDraft {
  /** Fingerprint of the source files the draft started from. */
  sourceHash: string;
  savedAt: string;
}

export interface CatalogEditorState {
  datasetId: string | null;
  datasetName: string;
  files: CatalogDatasetFiles | null;
  source: CatalogDraft | null;
  sourceHash: string;
  draft: CatalogDraft | null;
  savedAt: string | null;
  /** The draft came from local storage rather than the source files. */
  restored: boolean;
  /** The source files changed after the restored draft was started. */
  sourceChanged: boolean;
}

const initialCatalogEditorState: CatalogEditorState = {
  datasetId: null,
  datasetName: '',
  files: null,
  source: null,
  sourceHash: '',
  draft: null,
  savedAt: null,
  restored: false,
  sourceChanged: false
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/**
 * Keeps only the label lists, in a fixed key order. Drafts saved before the editor dropped the scraper
 * settings and item configs still carry those fields, so they are stripped when a draft is restored.
 */
const toCatalogConfig = ({ tags, categories }: CatalogConfig): CatalogConfig => ({ tags, categories });

export const catalogEditorStorageKey = (datasetId: string): string => `${CATALOG_EDITOR_STORAGE_KEY}.${datasetId}`;

const replaceLabelId = (ids: string[], from: string, to: string | null): string[] =>
  to === null ? ids.filter((id) => id !== from) : ids.map((id) => (id === from ? to : id));

const countUsage = (rows: { categories: string[]; tags: string[] }[], kind: LabelKind): Record<string, number> =>
  rows.reduce<Record<string, number>>((counts, row) => {
    row[kind].forEach((id) => (counts[id] = (counts[id] ?? 0) + 1));
    return counts;
  }, {});

const duplicates = (ids: string[]): string[] =>
  [...new Set(ids.filter((id, index) => id && ids.indexOf(id) !== index))].sort();

/**
 * Draft state for the catalog editor. Every change is written to local storage under the dataset's id,
 * so leaving the page loses nothing; the draft is only cleared by discarding it or by editing it back
 * to match the source files. "Saving" is manual: copy `configFile()` / `itemsFile()` over the JSON files.
 *
 * Provide it on the editor component, not in root, so each visit starts from `open()`.
 */
export const CatalogEditorStore = signalStore(
  withState(initialCatalogEditorState),
  withComputed(({ source, draft }) => {
    const sourceJson = computed(() => JSON.stringify(source()));
    const draftJson = computed(() => JSON.stringify(draft()));
    const labelIds = (kind: LabelKind) => computed(() => new Set((draft()?.config[kind] ?? []).map(({ id }) => id)));
    const categoryIds = labelIds('categories');
    const tagIds = labelIds('tags');

    return {
      dirty: computed(() => !!draft() && draftJson() !== sourceJson()),
      configFile: computed(() => {
        const current = draft();
        return current ? createConfigFile(current.config) : '';
      }),
      itemsFile: computed(() => {
        const current = draft();
        return current ? createItemsFile(current.items) : '';
      }),
      /** How many items use each label, by kind and id. */
      labelUsage: computed(() => {
        const rows = draft()?.items ?? [];
        return { categories: countUsage(rows, 'categories'), tags: countUsage(rows, 'tags') };
      }),
      /** Problems that would break the catalog once the files are replaced. */
      issues: computed(() => {
        const current = draft();
        if (!current) {
          return [];
        }
        const issues: string[] = [];
        const itemIds = new Set(current.items.map(({ id }) => id));
        const knownLabels = { categories: categoryIds(), tags: tagIds() };
        const unknownLabels = (rows: { categories: string[]; tags: string[] }[], what: string) =>
          (['categories', 'tags'] as const).forEach((kind) => {
            const unknown = [...new Set(rows.flatMap((row) => row[kind]))].filter((id) => !knownLabels[kind].has(id));
            if (unknown.length) {
              issues.push(`${what} use ${kind} that aren't defined: ${unknown.join(', ')}`);
            }
          });

        if (current.items.some(({ id }) => !id)) {
          issues.push('Some catalog items have no id.');
        }
        const duplicateItems = duplicates(current.items.map(({ id }) => id));
        if (duplicateItems.length) {
          issues.push(`Duplicate catalog item ids: ${duplicateItems.join(', ')}`);
        }
        unknownLabels(current.items, 'Catalog items');
        const missingIngredients = [
          ...new Set(current.items.flatMap(({ ingredients }) => ingredients.map(({ id }) => id)))
        ].filter((id) => !itemIds.has(id));
        if (missingIngredients.length) {
          issues.push(`Ingredients that aren't catalog items: ${missingIngredients.join(', ')}`);
        }
        return issues;
      })
    };
  }),
  withMethods((store, localStorage = inject(LocalStorageService)) => {
    /** Applies a change to the draft and autosaves it (or clears the saved draft when it matches the source again). */
    const updateDraft = (change: (draft: CatalogDraft) => CatalogDraft): void => {
      const draft = store.draft();
      const datasetId = store.datasetId();
      if (!draft || !datasetId) {
        return;
      }
      const next = change(draft);
      const key = catalogEditorStorageKey(datasetId);

      if (JSON.stringify(next) === JSON.stringify(store.source())) {
        localStorage.removeItem(key);
        patchState(store, { draft: next, savedAt: null, restored: false, sourceChanged: false });
        return;
      }
      const savedAt = new Date().toISOString();
      const persisted: PersistedCatalogDraft = { ...next, sourceHash: store.sourceHash(), savedAt };
      localStorage.setItem(key, persisted);
      patchState(store, { draft: next, savedAt });
    };

    const updateConfig = (change: (config: CatalogConfig) => CatalogConfig): void =>
      updateDraft((draft) => ({ ...draft, config: change(draft.config) }));

    const updateItems = (change: (list: Item[]) => Item[]): void =>
      updateDraft((draft) => ({ ...draft, items: change(draft.items) }));

    /** Renames (`to` is an id) or drops (`to` is null) a label everywhere it is used. */
    const rewriteLabelReferences = (kind: LabelKind, from: string, to: string | null) =>
      updateDraft((draft) => ({
        ...draft,
        items: draft.items.map((row) => ({ ...row, [kind]: replaceLabelId(row[kind], from, to) }))
      }));

    return {
      /** Loads a dataset, restoring its autosaved draft when there is one. */
      open(dataset: CatalogDataset): void {
        const source: CatalogDraft = clone({ config: toCatalogConfig(dataset.config), items: dataset.items });
        const sourceHash = hashString(JSON.stringify(source));
        const saved = localStorage.getItem<PersistedCatalogDraft>(catalogEditorStorageKey(dataset.id));
        const restored =
          Array.isArray(saved?.config?.tags) && Array.isArray(saved?.config?.categories) && Array.isArray(saved?.items);

        patchState(store, {
          datasetId: dataset.id,
          datasetName: dataset.name,
          files: dataset.files ?? null,
          source,
          sourceHash,
          draft: restored ? { config: toCatalogConfig(saved.config), items: saved.items } : clone(source),
          savedAt: restored ? saved.savedAt : null,
          restored,
          sourceChanged: restored && saved.sourceHash !== sourceHash
        });
      },

      /** Throws the draft away and starts again from the source files. */
      discardDraft(): void {
        const datasetId = store.datasetId();
        if (datasetId) {
          localStorage.removeItem(catalogEditorStorageKey(datasetId));
        }
        patchState(store, {
          draft: clone(store.source()),
          savedAt: null,
          restored: false,
          sourceChanged: false
        });
      },

      /** Adds a label named `name` with an id made from it. Returns the new id, or null if it is empty or taken. */
      addLabel(kind: LabelKind, name: string, icon: string): string | null {
        const id = toCatalogId(name);
        if (!id || store.draft()?.config[kind].some((label) => label.id === id)) {
          return null;
        }
        updateConfig((config) => ({ ...config, [kind]: [...config[kind], { id, name: name.trim(), icon }] }));
        return id;
      },

      updateLabel(kind: LabelKind, id: string, changes: Partial<Omit<ItemLabel, 'id'>>): void {
        updateConfig((config) => ({
          ...config,
          [kind]: config[kind].map((label) => (label.id === id ? { ...label, ...changes } : label))
        }));
      },

      /**
       * Changes a label's id and every reference to it. Returns the id the label ends up with:
       * the old one when the new id is empty or already used by another label.
       */
      renameLabel(kind: LabelKind, id: string, newId: string): string {
        const next = toCatalogId(newId);
        if (!next || next === id || store.draft()?.config[kind].some((label) => label.id === next)) {
          return id;
        }
        updateConfig((config) => ({
          ...config,
          [kind]: config[kind].map((label) => (label.id === id ? { ...label, id: next } : label))
        }));
        rewriteLabelReferences(kind, id, next);
        return next;
      },

      /** Deletes a label and removes it from every item. */
      removeLabel(kind: LabelKind, id: string): void {
        updateConfig((config) => ({ ...config, [kind]: config[kind].filter((label) => label.id !== id) }));
        rewriteLabelReferences(kind, id, null);
      },

      moveLabel(kind: LabelKind, id: string, offset: -1 | 1): void {
        updateConfig((config) => {
          const labels = [...config[kind]];
          const from = labels.findIndex((label) => label.id === id);
          const to = from + offset;
          if (from === -1 || to < 0 || to >= labels.length) {
            return config;
          }
          [labels[from], labels[to]] = [labels[to], labels[from]];
          return { ...config, [kind]: labels };
        });
      },

      /** Appends an empty item (with the given labels) and returns its index. */
      addItem(labels: Partial<Record<LabelKind, string[]>> = {}): number {
        updateItems((list) => [...list, { ...createEmptyItem(), ...labels }]);
        return (store.draft()?.items.length ?? 0) - 1;
      },

      /**
       * Adds a draft item for each pasted wiki url, with the given labels. Skips lines that aren't urls and
       * ids that already exist. Returns the indexes of the added items.
       */
      addItemsFromUrls(urls: string[], labels: Partial<Record<LabelKind, string[]>> = {}): number[] {
        const draft = store.draft();
        if (!draft) {
          return [];
        }
        const existing = new Set(draft.items.map(({ id }) => id));
        const added = urls
          .map(itemFromUrl)
          .filter((item): item is Item => !!item && !existing.has(item.id) && !!existing.add(item.id))
          .map((item) => ({ ...item, ...labels }));
        if (added.length) {
          updateItems((list) => [...list, ...added]);
        }
        return added.map((_, i) => draft.items.length + i);
      },

      /**
       * Appends finished items (e.g. from the "Add items" dialog). Skips items without an id and ids that
       * already exist. Returns the indexes of the added items.
       */
      addItems(items: Item[]): number[] {
        const draft = store.draft();
        if (!draft) {
          return [];
        }
        const existing = new Set(draft.items.map(({ id }) => id));
        const added = items.filter(({ id }) => !!id && !existing.has(id) && !!existing.add(id));
        if (added.length) {
          updateItems((list) => [...list, ...clone(added)]);
        }
        return added.map((_, i) => draft.items.length + i);
      },

      updateItem(index: number, changes: Partial<Item>): void {
        updateItems((list) => list.map((row, i) => (i === index ? { ...row, ...changes } : row)));
      },

      removeItems(indexes: number[]): void {
        const remove = new Set(indexes);
        updateItems((list) => list.filter((_, i) => !remove.has(i)));
      },

      /** Adds or removes one label on many items at once. */
      applyLabel(indexes: number[], kind: LabelKind, labelId: string, mode: 'add' | 'remove'): void {
        const selected = new Set(indexes);
        updateItems((list) =>
          list.map((row, i) => {
            if (!selected.has(i) || (mode === 'add' && row[kind].includes(labelId))) {
              return row;
            }
            return {
              ...row,
              [kind]: mode === 'add' ? [...row[kind], labelId] : row[kind].filter((id) => id !== labelId)
            };
          })
        );
      }
    };
  })
);

export type CatalogEditorStore = InstanceType<typeof CatalogEditorStore>;
