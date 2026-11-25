import { TestBed } from '@angular/core/testing';
import { Bundle, CatalogDataset, Item } from '@cozy-almanacs/models';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CatalogStore } from '../catalog/catalog.store';
import { BundleEditorStore } from './bundle-editor.store';
import { bundleTemplate } from './bundle-template';

const PREFIX = 'BUNDLE-EDITOR-TEST-';

const wood: Item = {
  id: 'wood',
  name: 'Wood',
  description: '',
  imageUrl: '',
  links: [],
  ingredients: [],
  categories: ['raw'],
  tags: []
};

const dataset = (bundles: Bundle[]): CatalogDataset => ({
  id: 'game',
  name: 'Game',
  config: { categories: [{ id: 'raw', name: 'Raw', icon: 'forest' }], tags: [] },
  items: [wood],
  bundles,
  files: { config: 'config.json', items: 'items.json', bundles: 'apps/game/bundles.json' }
});

describe('BundleEditorStore', () => {
  const createStore = (bundles: Bundle[] = [{ id: 'room', name: 'Room' }]) => {
    TestBed.configureTestingModule({ providers: [BundleEditorStore, getLocalStorageToken(PREFIX)] });
    const data = dataset(bundles);
    TestBed.inject(CatalogStore).init(data.items, data.config);
    const store = TestBed.inject(BundleEditorStore);
    store.open(data);
    return store;
  };

  beforeEach(() => localStorage.clear());

  it('opens a dataset with no changes', () => {
    const store = createStore();
    expect(store.draft()).toEqual([{ id: 'room', name: 'Room' }]);
    expect(store.filePath()).toBe('apps/game/bundles.json');
    expect(store.dirty()).toBe(false);
  });

  it('adds nested bundles with unique ids and autosaves the draft', () => {
    const store = createStore();
    expect(store.addBundle([0])).toEqual([0, 0]);
    expect(store.addBundle([0])).toEqual([0, 1]);

    expect(store.draft()?.[0].bundles?.map(({ id }) => id)).toEqual(['new_bundle', 'new_bundle_2']);
    expect(store.dirty()).toBe(true);
    expect(localStorage.getItem(`${PREFIX}bundle-editor.game`)).toContain('new_bundle_2');
  });

  it('restores an autosaved draft and clears it when the draft matches the source again', () => {
    let store = createStore();
    store.updateBundle([0], { name: 'Changed' });
    TestBed.resetTestingModule();

    store = createStore();
    expect(store.restored()).toBe(true);
    expect(store.draft()?.[0].name).toBe('Changed');

    store.updateBundle([0], { name: 'Room' });
    expect(store.dirty()).toBe(false);
    expect(localStorage.getItem(`${PREFIX}bundle-editor.game`)).toBeNull();
  });

  it('edits, moves and removes items, keeping the file short', () => {
    const store = createStore();
    store.addItems([0], [{ itemId: 'wood' }, { id: 'note_1', name: 'Note 1', quantity: 1 }]);
    store.updateItem([0], 0, { quantity: 99 });
    store.moveItem([0], 1, -1);

    expect(store.draft()?.[0].items).toEqual([
      { id: 'note_1', name: 'Note 1' },
      { itemId: 'wood', quantity: 99 }
    ]);
    store.removeItem([0], 0);
    expect(store.draft()?.[0].items).toEqual([{ itemId: 'wood', quantity: 99 }]);
  });

  it('adds catalog items or one-offs from wiki urls', () => {
    const store = createStore();
    const added = store.addItemsFromUrls(
      [0],
      ['https://wiki.example/Wood', 'https://wiki.example/Secret_Notes', 'not a url']
    );
    expect(added).toBe(2);
    expect(store.draft()?.[0].items).toEqual([
      { itemId: 'wood' },
      expect.objectContaining({ id: 'secret_notes', name: 'Secret Notes' })
    ]);
  });

  it('inserts the template, duplicates, moves and removes bundles', () => {
    const store = createStore();
    expect(store.insertBundle(null, bundleTemplate)).toEqual([1]);
    expect(store.draft()?.[1].id).toBe('new_bundle');

    expect(store.duplicateBundle([0])).toEqual([1]);
    expect(store.draft()?.map(({ id }) => id)).toEqual(['room', 'room_copy', 'new_bundle']);

    expect(store.moveBundle([2], -1)).toEqual([1]);
    expect(store.moveBundle([0], -1)).toEqual([0]);
    store.removeBundle([0]);
    expect(store.draft()?.map(({ id }) => id)).toEqual(['new_bundle', 'room_copy']);
  });

  it('reports duplicate ids, unknown items and unknown filter labels', () => {
    const store = createStore([
      { id: 'a', name: 'A', items: [{ itemId: 'wood' }, { itemId: 'wood' }, { itemId: 'nope' }] },
      { id: 'a', name: 'A2', itemFilter: { categories: ['missing'] } }
    ]);
    expect(store.issues()).toEqual([
      'Duplicate bundle ids: a',
      'A lists these more than once (give repeats their own id): wood',
      "A uses items that aren't in the catalog: nope",
      "A2 filters on labels that aren't defined: missing"
    ]);
  });

  it('exports the draft as a bundles.json file', () => {
    const store = createStore();
    store.addItems([0], [{ itemId: 'wood', quantity: 99 }]);
    expect(store.bundlesFile()).toBe(
      '[\n' +
        '  {\n' +
        '    "id": "room",\n' +
        '    "name": "Room",\n' +
        '    "items": [{ "itemId": "wood", "quantity": 99 }]\n' +
        '  }\n' +
        ']\n'
    );
  });
});
