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
});
