import { TestBed } from '@angular/core/testing';
import { Item } from '@crafting-cart/shared/models';
import { CatalogStore } from './catalog.store';

describe('CatalogStore', () => {
  const createItem = (id: string) => ({ id, name: `name-${id}` }) as Item;

  it('should start empty and not loaded', () => {
    const store = TestBed.inject(CatalogStore);

    expect(store.entities()).toEqual([]);
    expect(store.loaded()).toBe(false);
  });

  it('init() should set the catalog and mark it loaded', () => {
    const store = TestBed.inject(CatalogStore);
    store.init([createItem('PRODUCT-AAA'), createItem('PRODUCT-ZZZ')]);

    expect(store.ids()).toEqual(['PRODUCT-AAA', 'PRODUCT-ZZZ']);
    expect(store.entityMap()['PRODUCT-ZZZ']?.name).toBe('name-PRODUCT-ZZZ');
    expect(store.loaded()).toBe(true);
  });

  it('init() should index the config-level categories and tags by id', () => {
    const store = TestBed.inject(CatalogStore);
    store.init([{ ...createItem('bomb'), categories: ['crafting'], tags: ['bombs'] }], {
      categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }],
      tags: [{ id: 'bombs', name: 'Bombs', icon: 'bomb' }]
    });

    const item = store.entityMap()['bomb'];
    expect(item?.categories.map((id) => store.categoryMap()[id]?.icon)).toEqual(['handyman']);
    expect(item?.tags.map((id) => store.tagMap()[id]?.name)).toEqual(['Bombs']);
  });

  it('init() without labels should leave the lookups empty', () => {
    const store = TestBed.inject(CatalogStore);
    store.init([createItem('bomb')]);

    expect(store.categoryMap()).toEqual({});
    expect(store.tagMap()).toEqual({});
  });
});
