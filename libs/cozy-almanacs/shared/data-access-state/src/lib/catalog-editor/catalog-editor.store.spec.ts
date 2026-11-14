import { TestBed } from '@angular/core/testing';
import { CatalogDataset, Item } from '@cozy-almanacs/models';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CatalogEditorStore, PersistedCatalogDraft, catalogEditorStorageKey } from './catalog-editor.store';

describe('CatalogEditorStore', () => {
  const storageKey = `TEST-${catalogEditorStorageKey('stardew')}`;

  const item = (id: string, overrides: Partial<Item> = {}): Item => ({
    id,
    name: id,
    description: '',
    imageUrl: '',
    links: [],
    ingredients: [],
    categories: ['crafting'],
    tags: ['bombs'],
    ...overrides
  });

  const createDataset = (): CatalogDataset => ({
    id: 'stardew',
    name: 'Stardew Valley',
    config: {
      tags: [
        { id: 'bombs', name: 'Bombs', icon: 'bomb' },
        { id: 'fences', name: 'Fences', icon: 'fence' }
      ],
      categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }]
    },
    items: [
      item('bomb', { ingredients: [{ id: 'coal', quantity: 1 }] }),
      item('coal', { tags: [] }),
      item('gate', { tags: ['fences'] })
    ]
  });

  const setup = () => {
    TestBed.configureTestingModule({ providers: [CatalogEditorStore, getLocalStorageToken('TEST-')] });
    const store = TestBed.inject(CatalogEditorStore);
    store.open(createDataset());
    return store;
  };

  const saved = () => JSON.parse(localStorage.getItem(storageKey) ?? 'null') as PersistedCatalogDraft | null;

  afterEach(() => localStorage.clear());

  it('opens a dataset as an unchanged draft without writing to local storage', () => {
    const store = setup();

    expect(store.datasetName()).toBe('Stardew Valley');
    expect(store.draft()?.items.length).toBe(3);
    expect(store.dirty()).toBe(false);
    expect(store.restored()).toBe(false);
    expect(saved()).toBeNull();
  });

  it('autosaves every change under the dataset id', () => {
    const store = setup();
    store.updateItem(0, { name: 'Big Bomb' });

    expect(store.dirty()).toBe(true);
    expect(store.savedAt()).not.toBeNull();
    expect(saved()?.items[0].name).toBe('Big Bomb');
  });

  it('clears the saved draft when it is edited back to match the source', () => {
    const store = setup();
    store.updateItem(0, { name: 'Big Bomb' });
    store.updateItem(0, { name: 'bomb' });

    expect(store.dirty()).toBe(false);
    expect(saved()).toBeNull();
  });

  it('restores a saved draft on open and notices when the source changed since', () => {
    setup().updateLabel('tags', 'bombs', { name: 'Explosives' });
    TestBed.resetTestingModule();

    const store = setup();
    expect(store.restored()).toBe(true);
    expect(store.sourceChanged()).toBe(false);
    expect(store.draft()?.config.tags[0].name).toBe('Explosives');

    const changed = createDataset();
    changed.items.push(item('wood'));
    store.open(changed);
    expect(store.sourceChanged()).toBe(true);
  });

  it('drops scraper settings and item configs from a draft saved by an older editor', () => {
    const dataset = createDataset();
    const old = {
      config: {
        baseUrl: 'https://stardewvalleywiki.com/',
        configOutputPath: './scrapers/stardew-output.ts',
        ...dataset.config,
        items: [{ itemUrl: 'Bomb', itemId: 'bomb', categories: [], tags: [] }]
      },
      items: dataset.items,
      sourceHash: 'old',
      savedAt: '2026-11-01T00:00:00.000Z'
    };
    localStorage.setItem(storageKey, JSON.stringify(old));

    const store = setup();
    expect(store.restored()).toBe(true);
    expect(store.draft()?.config).toEqual(dataset.config);
    expect(store.dirty()).toBe(false);
    expect(store.configFile()).not.toContain('baseUrl');
  });

  it('discards the draft back to the source', () => {
    const store = setup();
    store.removeItems([0]);
    store.discardDraft();

    expect(store.draft()?.items.length).toBe(3);
    expect(store.dirty()).toBe(false);
    expect(saved()).toBeNull();
  });

  it('renames a label id everywhere it is used, and refuses an id that is taken', () => {
    const store = setup();

    expect(store.renameLabel('tags', 'bombs', 'Explosives')).toBe('explosives');
    expect(store.draft()?.config.tags[0]).toEqual({ id: 'explosives', name: 'Bombs', icon: 'bomb' });
    expect(store.draft()?.items[0].tags).toEqual(['explosives']);

    expect(store.renameLabel('tags', 'explosives', 'fences')).toBe('explosives');
  });

  it('removes a label from every row', () => {
    const store = setup();
    store.removeLabel('tags', 'bombs');

    expect(store.draft()?.config.tags.map(({ id }) => id)).toEqual(['fences']);
    expect(store.draft()?.items[0].tags).toEqual([]);
  });

  it('adds labels with ids made from their names, once', () => {
    const store = setup();

    expect(store.addLabel('categories', ' Raw Materials ', 'forest')).toBe('raw_materials');
    expect(store.addLabel('categories', 'raw materials', 'forest')).toBeNull();
    expect(store.draft()?.config.categories[1]).toEqual({ id: 'raw_materials', name: 'Raw Materials', icon: 'forest' });
  });

  it('adds and removes a label on many items at once', () => {
    const store = setup();
    store.applyLabel([0, 1], 'tags', 'fences', 'add');

    expect(store.draft()?.items.map(({ tags }) => tags)).toEqual([['bombs', 'fences'], ['fences'], ['fences']]);

    store.applyLabel([1], 'tags', 'fences', 'remove');
    expect(store.draft()?.items[1].tags).toEqual([]);
  });

  it('adds an empty item with the given labels and returns its index', () => {
    const store = setup();
    const index = store.addItem({ tags: ['bombs'] });

    expect(index).toBe(3);
    expect(store.draft()?.items[index]).toMatchObject({ id: '', categories: [], tags: ['bombs'] });
  });

  it('counts label usage and reports problems', () => {
    const store = setup();
    expect(store.labelUsage().tags).toEqual({ bombs: 1, fences: 1 });
    expect(store.issues()).toEqual([]);

    store.addItem();
    store.updateItem(0, { tags: ['unknown'], ingredients: [{ id: 'iron', quantity: 2 }] });
    expect(store.issues()).toEqual([
      'Some catalog items have no id.',
      "Catalog items use tags that aren't defined: unknown",
      "Ingredients that aren't catalog items: iron"
    ]);
  });

  it('generates the config and items files from the draft', () => {
    const store = setup();
    store.updateLabel('categories', 'crafting', { name: 'Craftables' });

    expect(store.configFile()).toContain("{ id: 'crafting', name: 'Craftables', icon: 'handyman' }");
    expect(store.itemsFile().startsWith('export const items = [\n')).toBe(true);
  });
});
