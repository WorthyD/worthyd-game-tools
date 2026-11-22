import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CatalogStore } from '@cozy-almanacs/state';
import { AppComponent } from './app.component';
import { catalogDatasets } from './catalog/datasets';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  afterEach(() => catalogDatasets.splice(0));

  it(`should have as title 'cozy-almanacs'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cozy-almanacs');
  });

  it('should ship no game data of its own', () => {
    expect(catalogDatasets).toEqual([]);
    TestBed.createComponent(AppComponent);
    const catalog = TestBed.inject(CatalogStore);
    expect(catalog.loaded()).toBe(true);
    expect(catalog.ids()).toEqual([]);
  });

  it('should load the first dataset into the CatalogStore', () => {
    const categories = [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }];
    const tags = [{ id: 'bombs', name: 'Bombs', icon: 'bomb' }];
    const item = {
      id: 'bomb',
      name: 'Bomb',
      description: '',
      imageUrl: './images/bomb.png',
      links: [],
      categories: ['crafting'],
      tags: ['bombs'],
      ingredients: []
    };
    catalogDatasets.push({ id: 'test', name: 'Test', config: { categories, tags }, items: [item] });

    TestBed.createComponent(AppComponent);
    const catalog = TestBed.inject(CatalogStore);
    expect(catalog.ids()).toEqual(['bomb']);
    expect(catalog.categories()).toEqual(categories);
    expect(catalog.tags()).toEqual(tags);
  });
});
