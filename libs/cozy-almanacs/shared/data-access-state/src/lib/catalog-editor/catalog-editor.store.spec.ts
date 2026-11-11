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
      baseUrl: 'https://stardewvalleywiki.com/',
      assetPath: './images/',
      imagePath: './scrapers/images/',
      configOutputPath: './scrapers/stardew-output.ts',
      categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }],
      tags: [
        { id: 'bombs', name: 'Bombs', icon: 'bomb' },
        { id: 'fences', name: 'Fences', icon: 'fence' }
      ],
      items: [
        { itemUrl: 'Bomb', itemId: 'bomb', categories: ['crafting'], tags: ['bombs'] },
        { itemUrl: 'Gate', itemId: 'gate', categories: ['crafting'], tags: ['fences'] }
      ]
    },
    items: [item('bomb', { ingredients: [{ id: 'coal', quantity: 1 }] }), item('coal', { tags: [] })]
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
    expect(store.draft()?.items.length).toBe(2);
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
    setup().updateSettings({ baseUrl: 'https://example.com/' });
    TestBed.resetTestingModule();

    const store = setup();
    expect(store.restored()).toBe(true);
    expect(store.sourceChanged()).toBe(false);
    expect(store.draft()?.config.baseUrl).toBe('https://example.com/');

    const changed = createDataset();
    changed.items.push(item('wood'));
    store.open(changed);
    expect(store.sourceChanged()).toBe(true);
  });

  it('discards the draft back to the source', () => {
    const store = setup();
    store.removeRows('items', [0]);
    store.discardDraft();

    expect(store.draft()?.items.length).toBe(2);
    expect(store.dirty()).toBe(false);
    expect(saved()).toBeNull();
  });

  it('renames a label id everywhere it is used, and refuses an id that is taken', () => {
    const store = setup();

    expect(store.renameLabel('tags', 'bombs', 'Explosives')).toBe('explosives');
    expect(store.draft()?.config.tags[0]).toEqual({ id: 'explosives', name: 'Bombs', icon: 'bomb' });
    expect(store.draft()?.config.items[0].tags).toEqual(['explosives']);
    expect(store.draft()?.items[0].tags).toEqual(['explosives']);

    expect(store.renameLabel('tags', 'explosives', 'fences')).toBe('explosives');
  });

  it('removes a label from every row', () => {
    const store = setup();
    store.removeLabel('tags', 'bombs');

    expect(store.draft()?.config.tags.map(({ id }) => id)).toEqual(['fences']);
    expect(store.draft()?.config.items[0].tags).toEqual([]);
    expect(store.draft()?.items[0].tags).toEqual([]);
  });

  it('adds labels with ids made from their names, once', () => {
    const store = setup();

    expect(store.addLabel('categories', ' Raw Materials ', 'forest')).toBe('raw_materials');
    expect(store.addLabel('categories', 'raw materials', 'forest')).toBeNull();
    expect(store.draft()?.config.categories[1]).toEqual({ id: 'raw_materials', name: 'Raw Materials', icon: 'forest' });
  });

  it('adds and removes a label on many rows at once', () => {
    const store = setup();
    store.applyLabel('itemConfigs', [0, 1], 'tags', 'fences', 'add');

    expect(store.draft()?.config.items.map(({ tags }) => tags)).toEqual([['bombs', 'fences'], ['fences']]);

    store.applyLabel('itemConfigs', [1], 'tags', 'fences', 'remove');
    expect(store.draft()?.config.items[1].tags).toEqual([]);
  });

  it('adds item configs from pasted urls, skipping blanks and existing ids', () => {
    const store = setup();
    const added = store.addItemConfigsFromUrls([
      'https://stardewvalleywiki.com/Cherry_Bomb',
      '',
      'Bomb',
      'Wood_Fence',
      'Wood_Fence'
    ]);

    expect(added).toBe(2);
    expect(store.draft()?.config.items.slice(2)).toEqual([
      { itemUrl: 'Cherry_Bomb', itemId: 'cherry_bomb', categories: [], tags: [] },
      { itemUrl: 'Wood_Fence', itemId: 'wood_fence', categories: [], tags: [] }
    ]);
  });

  it('sets an item config url from a wiki url and fills in a missing id', () => {
    const store = setup();
    const index = store.addRow('itemConfigs');
    store.setItemConfigUrl(index, 'https://stardewvalleywiki.com/Mega_Bomb');

    expect(store.draft()?.config.items[index]).toMatchObject({ itemUrl: 'Mega_Bomb', itemId: 'mega_bomb' });
  });

  it('counts label usage and reports problems', () => {
    const store = setup();
    expect(store.labelUsage().tags).toEqual({ bombs: 2, fences: 1 });
    expect(store.issues()).toEqual([]);

    store.addRow('items');
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
