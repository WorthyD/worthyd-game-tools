import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BundleStore, CatalogStore } from '@cozy-almanacs/state';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { AppComponent } from './app.component';
import { config } from './catalog/config';
import { items } from './catalog/items';
import { bundles } from './catalog/bundles';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), getLocalStorageToken('APP-TEST-')]
    }).compileComponents();
  });

  it(`should have as title 'stardew-cozy-almanacs'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('stardew-cozy-almanacs');
  });

  it('should load the Stardew catalog into the CatalogStore', () => {
    TestBed.createComponent(AppComponent);
    const catalog = TestBed.inject(CatalogStore);
    expect(catalog.loaded()).toBe(true);
    expect(catalog.ids()).toEqual([...new Set(items.map((item) => item.id))]);
  });

  it('should resolve every item category and tag id from the config', () => {
    TestBed.createComponent(AppComponent);
    const catalog = TestBed.inject(CatalogStore);
    expect(catalog.categories()).toEqual(config.categories);
    expect(catalog.tags()).toEqual(config.tags);
    for (const item of items) {
      item.categories.forEach((id) => expect(catalog.categoryMap()[id]).toBeDefined());
      item.tags.forEach((id) => expect(catalog.tagMap()[id]).toBeDefined());
    }
  });

  it('should load the Stardew bundles into the BundleStore', () => {
    TestBed.createComponent(AppComponent);
    const store = TestBed.inject(BundleStore);
    expect(store.datasetId()).toBe('stardew');
    expect(store.bundles()).toEqual(bundles);
  });
});
