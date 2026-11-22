import { TestBed } from '@angular/core/testing';
import { Item } from '@cozy-almanacs/models';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CatalogStore } from '../catalog/catalog.store';
import { BundleStore } from './bundle.store';

const PREFIX = 'BUNDLE-TEST-';

const wood: Item = {
  id: 'wood',
  name: 'Wood',
  description: '',
  imageUrl: '',
  links: [],
  ingredients: [],
  categories: [],
  tags: []
};

describe('BundleStore', () => {
  const createStore = () => {
    TestBed.configureTestingModule({ providers: [getLocalStorageToken(PREFIX)] });
    TestBed.inject(CatalogStore).init([wood]);
    const store = TestBed.inject(BundleStore);
    store.init('game', [
      {
        id: 'room',
        name: 'Room',
        bundles: [{ id: 'notes', name: 'Notes', items: [{ itemId: 'wood' }, { id: 'note_1', name: 'Note 1' }] }]
      }
    ]);
    return store;
  };

  beforeEach(() => localStorage.clear());

  it('resolves bundles against the catalog', () => {
    const store = createStore();
    expect(
      store
        .resolvedMap()
        .get('notes')
        ?.items.map(({ name }) => name)
    ).toEqual(['Wood', 'Note 1']);
  });

  it('collects and turns in items, and saves progress per dataset', () => {
    const store = createStore();
    store.setCollected('notes/wood', true);
    store.setTurnedIn('notes/note_1', true);

    expect(store.progress()).toEqual({
      'notes/wood': { collected: true },
      'notes/note_1': { collected: true, turnedIn: true }
    });
    expect(store.resolvedMap().get('room')?.totalCollected).toBe(2);
    expect(JSON.parse(localStorage.getItem(`${PREFIX}bundle-progress.game`) ?? '{}')).toEqual(store.progress());
  });

  it('un-collecting an item also clears turned in, and clearing both forgets it', () => {
    const store = createStore();
    store.setTurnedIn('notes/wood', true);
    store.setCollected('notes/wood', false);
    expect(store.progress()).toEqual({});
  });

  it('loads saved progress on init', () => {
    localStorage.setItem(`${PREFIX}bundle-progress.game`, JSON.stringify({ 'notes/wood': { collected: true } }));
    const store = createStore();
    expect(store.resolvedMap().get('notes')?.items[0].collected).toBe(true);
  });

  it('resets a bundle and the bundles inside it', () => {
    const store = createStore();
    store.setCollected('notes/wood', true);
    store.resetBundle('room');
    expect(store.progress()).toEqual({});
  });
});
