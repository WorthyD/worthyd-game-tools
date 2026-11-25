import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CatalogDatasetSource } from '@cozy-almanacs/models';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { BundleStore } from '../bundles/bundle.store';
import { CatalogStore } from '../catalog/catalog.store';
import { provideCatalogDatasets } from '../catalog-editor/catalog-datasets.token';
import { CatalogDatasetLoader } from './catalog-dataset.loader';

const source: CatalogDatasetSource = {
  id: 'game',
  name: 'Game',
  urls: { config: 'catalog/game/config.json', items: 'catalog/game/items.json', bundles: 'catalog/game/bundles.json' },
  files: { config: 'apps/game/config.json', items: 'apps/game/items.json' }
};
const config = { categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }], tags: [] };
const items = [
  {
    id: 'bomb',
    name: 'Bomb',
    description: '',
    imageUrl: './images/bomb.png',
    links: [],
    ingredients: [],
    categories: ['crafting'],
    tags: []
  }
];
const bundles = [{ id: 'notes', name: 'Notes', items: [{ itemId: 'bomb' }] }];

describe('CatalogDatasetLoader', () => {
  let http: HttpTestingController;

  const setup = (sources: CatalogDatasetSource[] = [source]) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        getLocalStorageToken('LOADER-TEST-'),
        provideCatalogDatasets(sources)
      ]
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(CatalogDatasetLoader);
  };

  /** Lets the loader's awaits run, then answers its requests. */
  const respond = async (responses: Record<string, unknown>) => {
    await Promise.resolve();
    for (const [url, body] of Object.entries(responses)) {
      http.expectOne(url).flush(body);
    }
  };

  afterEach(() => http.verify());

  it('finds sources by id, or the first one without an id', () => {
    const loader = setup();
    expect(loader.source()).toBe(source);
    expect(loader.source('game')).toBe(source);
    expect(loader.source('other')).toBeUndefined();
  });

  it('fetches and checks the files once per dataset', async () => {
    const loader = setup();
    const first = loader.load(source);
    const second = loader.load(source);
    await respond({ [source.urls.config]: config, [source.urls.items]: items, [source.urls.bundles ?? '']: bundles });

    const dataset = await first;
    expect(dataset).toEqual({ id: 'game', name: 'Game', config, items, bundles, files: source.files });
    expect(await second).toBe(dataset);
  });

  it('defaults to no bundles when the dataset has no bundles file', async () => {
    const loader = setup();
    const loading = loader.load({ ...source, urls: { config: 'c.json', items: 'i.json' } });
    await respond({ 'c.json': config, 'i.json': items });

    expect((await loading).bundles).toEqual([]);
  });

  it('rejects files that do not match the schema, and tries again next time', async () => {
    const loader = setup();
    const loading = loader.load(source);
    await respond({
      [source.urls.config]: config,
      [source.urls.items]: [{ id: 'bomb' }],
      [source.urls.bundles ?? '']: []
    });

    await expect(loading).rejects.toThrow(
      "catalog/game/items.json doesn't match the catalog schema:\nitems[0].name is missing"
    );

    const retry = loader.load(source);
    await respond({ [source.urls.config]: config, [source.urls.items]: items, [source.urls.bundles ?? '']: [] });
    expect((await retry).items).toEqual(items);
  });

  it('loads the active dataset into the catalog and bundle stores', async () => {
    const loader = setup();
    const loading = loader.loadActive();
    await respond({ [source.urls.config]: config, [source.urls.items]: items, [source.urls.bundles ?? '']: bundles });

    expect(await loading).toBe(true);
    const catalog = TestBed.inject(CatalogStore);
    expect(catalog.loaded()).toBe(true);
    expect(catalog.ids()).toEqual(['bomb']);
    expect(catalog.categories()).toEqual(config.categories);
    expect(TestBed.inject(BundleStore).datasetId()).toBe('game');
    expect(TestBed.inject(BundleStore).bundles()).toEqual(bundles);
    expect(await loader.loadActive()).toBe(true);
  });

  it('loads an empty catalog when the app has no datasets', async () => {
    const loader = setup([]);

    expect(await loader.loadActive()).toBe(true);
    expect(TestBed.inject(CatalogStore).loaded()).toBe(true);
    expect(TestBed.inject(CatalogStore).ids()).toEqual([]);
  });

  it('leaves the stores empty when the files fail to load', async () => {
    const loader = setup();
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const loading = loader.loadActive();
    await Promise.resolve();
    http.expectOne(source.urls.config).flush('Not found', { status: 404, statusText: 'Not Found' });
    http.expectOne(source.urls.items).flush(items);
    http.expectOne(source.urls.bundles ?? '').flush([]);

    expect(await loading).toBe(false);
    expect(TestBed.inject(CatalogStore).loaded()).toBe(false);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
