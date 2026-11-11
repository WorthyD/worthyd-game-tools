import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  CatalogDataset,
  CatalogDatasetFiles,
  Item,
  ItemConfig,
  ItemLabel,
  ScraperConfig
} from '@cozy-almanacs/models';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';
import { createConfigFile, createItemsFile } from './catalog-files';
import {
  createEmptyItem,
  createEmptyItemConfig,
  hashString,
  itemIdFromUrl,
  toCatalogId,
  toItemUrl
} from './catalog-editor.utils';

export const CATALOG_EDITOR_STORAGE_KEY = 'catalog-editor';

export type LabelKind = 'categories' | 'tags';
/** The two editable lists: the scraper's item configs (`config.items`) and the scraped catalog items. */
export type EditorRows = 'itemConfigs' | 'items';
export type ConfigSettings = Pick<ScraperConfig, 'baseUrl' | 'assetPath' | 'imagePath' | 'configOutputPath'>;

export interface CatalogDraft {
  config: ScraperConfig;
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
 * to match the source files. "Saving" is manual: copy `configFile()` / `itemsFile()` over the files.
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
      /** How many item configs and items use each label, by kind and id. */
      labelUsage: computed(() => {
        const rows = [...(draft()?.config.items ?? []), ...(draft()?.items ?? [])];
        return { categories: countUsage(rows, 'categories'), tags: countUsage(rows, 'tags') };
      }),
      /** Problems that would break the catalog or the scraper once the files are replaced. */
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

        const configIds = current.config.items.map(({ itemId }) => itemId);
        if (configIds.some((id) => !id)) {
          issues.push('Some item configs have no item id.');
        }
        if (duplicates(configIds).length) {
          issues.push(`Duplicate item config ids: ${duplicates(configIds).join(', ')}`);
        }
        if (current.items.some(({ id }) => !id)) {
          issues.push('Some catalog items have no id.');
        }
        const duplicateItems = duplicates(current.items.map(({ id }) => id));
        if (duplicateItems.length) {
          issues.push(`Duplicate catalog item ids: ${duplicateItems.join(', ')}`);
        }
        unknownLabels(current.config.items, 'Item configs');
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

    const updateConfig = (change: (config: ScraperConfig) => ScraperConfig): void =>
      updateDraft((draft) => ({ ...draft, config: change(draft.config) }));

    const updateRows = <T extends ItemConfig | Item>(rows: EditorRows, change: (list: T[]) => T[]): void =>
      updateDraft((draft) =>
        rows === 'items'
          ? { ...draft, items: change(draft.items as T[]) as Item[] }
          : { ...draft, config: { ...draft.config, items: change(draft.config.items as T[]) as ItemConfig[] } }
      );

    /** Renames (`to` is an id) or drops (`to` is null) a label everywhere it is used. */
    const rewriteLabelReferences = (kind: LabelKind, from: string, to: string | null) =>
      updateDraft((draft) => ({
        config: {
          ...draft.config,
          items: draft.config.items.map((row) => ({ ...row, [kind]: replaceLabelId(row[kind], from, to) }))
        },
        items: draft.items.map((row) => ({ ...row, [kind]: replaceLabelId(row[kind], from, to) }))
      }));

    return {
      /** Loads a dataset, restoring its autosaved draft when there is one. */
      open(dataset: CatalogDataset): void {
        const source: CatalogDraft = clone({ config: dataset.config, items: dataset.items });
        const sourceHash = hashString(JSON.stringify(source));
        const saved = localStorage.getItem<PersistedCatalogDraft>(catalogEditorStorageKey(dataset.id));
        const restored = !!saved?.config && Array.isArray(saved.items);

        patchState(store, {
          datasetId: dataset.id,
          datasetName: dataset.name,
          files: dataset.files ?? null,
          source,
          sourceHash,
          draft: restored ? { config: saved.config, items: saved.items } : clone(source),
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

      updateSettings(changes: Partial<ConfigSettings>): void {
        updateConfig((config) => ({ ...config, ...changes }));
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

      /** Deletes a label and removes it from every item config and item. */
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

      /** Appends an empty row (with the given labels) and returns its index. */
      addRow(rows: EditorRows, labels: Partial<Record<LabelKind, string[]>> = {}): number {
        const row = rows === 'items' ? createEmptyItem() : createEmptyItemConfig();
        updateRows(rows, (list) => [...list, { ...row, ...labels }]);
        const length = rows === 'items' ? store.draft()?.items.length : store.draft()?.config.items.length;
        return (length ?? 0) - 1;
      },

      /** Adds an item config for each pasted wiki url, skipping blank lines and ids that already exist. Returns how many were added. */
      addItemConfigsFromUrls(urls: string[]): number {
        const baseUrl = store.draft()?.config.baseUrl ?? '';
        const existing = new Set(store.draft()?.config.items.map(({ itemId }) => itemId));
        const added = urls
          .map((url) => toItemUrl(url, baseUrl))
          .filter((itemUrl) => itemUrl)
          .map((itemUrl) => ({ ...createEmptyItemConfig(), itemUrl, itemId: itemIdFromUrl(itemUrl) }))
          .filter(({ itemId }) => !existing.has(itemId) && existing.add(itemId));
        if (added.length) {
          updateRows<ItemConfig>('itemConfigs', (list) => [...list, ...added]);
        }
        return added.length;
      },

      updateItemConfig(index: number, changes: Partial<ItemConfig>): void {
        updateRows<ItemConfig>('itemConfigs', (list) =>
          list.map((row, i) => (i === index ? { ...row, ...changes } : row))
        );
      },

      /** Sets an item config's url from a pasted wiki url, and fills in its id when it has none. */
      setItemConfigUrl(index: number, url: string): void {
        const itemUrl = toItemUrl(url, store.draft()?.config.baseUrl ?? '');
        updateRows<ItemConfig>('itemConfigs', (list) =>
          list.map((row, i) => (i === index ? { ...row, itemUrl, itemId: row.itemId || itemIdFromUrl(itemUrl) } : row))
        );
      },

      updateItem(index: number, changes: Partial<Item>): void {
        updateRows<Item>('items', (list) => list.map((row, i) => (i === index ? { ...row, ...changes } : row)));
      },

      removeRows(rows: EditorRows, indexes: number[]): void {
        const remove = new Set(indexes);
        updateRows(rows, (list) => list.filter((_, i) => !remove.has(i)));
      },

      /** Adds or removes one label on many rows at once. */
      applyLabel(rows: EditorRows, indexes: number[], kind: LabelKind, labelId: string, mode: 'add' | 'remove'): void {
        const selected = new Set(indexes);
        updateRows(rows, (list) =>
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
