import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CatalogStore } from '@crafting-cart/state';
import { AppComponent } from './app.component';
import { config } from './catalog/config';
import { items } from './catalog/items';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it(`should have as title 'craft-cart'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('craft-cart');
  });

  it('should load the catalog into the CatalogStore', () => {
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
});
