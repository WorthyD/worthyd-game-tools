import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CatalogDataset, CatalogDatasetSource } from '@cozy-almanacs/models';
import { CatalogDatasetLoader, CatalogStore } from '@cozy-almanacs/state';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { BundleEditorComponent } from './bundle-editor.component';

const dataset: CatalogDataset = {
  id: 'game',
  name: 'Game',
  config: { categories: [{ id: 'cooking', name: 'Cooking', icon: 'skillet' }], tags: [] },
  items: [
    {
      id: 'wood',
      name: 'Wood',
      description: '',
      imageUrl: './images/wood.png',
      links: [],
      ingredients: [],
      categories: [],
      tags: []
    },
    {
      id: 'cake',
      name: 'Cake',
      description: '',
      imageUrl: '',
      links: [],
      ingredients: [],
      categories: ['cooking'],
      tags: []
    }
  ],
  bundles: [{ id: 'room', name: 'Room', bundles: [{ id: 'construction', name: 'Construction' }] }],
  files: { config: 'config.json', items: 'items.json', bundles: 'apps/game/bundles.json' }
};
const source: CatalogDatasetSource = { id: dataset.id, name: dataset.name, urls: { config: '', items: '' } };
/** Stands in for the HTTP fetch; the loader itself is covered by its own spec. */
const loader: Pick<CatalogDatasetLoader, 'sources' | 'source' | 'load'> = {
  sources: [source],
  source: (id) => (!id || id === source.id ? source : undefined),
  load: () => Promise.resolve(dataset)
};

describe('BundleEditorComponent', () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [
        getLocalStorageToken('BUNDLE-EDITOR-UI-'),
        { provide: CatalogDatasetLoader, useValue: loader },
        provideRouter([{ path: 'bundles/config', component: BundleEditorComponent }])
      ]
    });
    TestBed.inject(CatalogStore).init(dataset.items, dataset.config);
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/bundles/config', BundleEditorComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    const root = harness.routeNativeElement as HTMLElement;
    const click = (selector: string, index = 0) => {
      (root.querySelectorAll(selector)[index] as HTMLElement).click();
      harness.detectChanges();
    };
    const buttonByText = (text: string) =>
      Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes(text)) as HTMLElement;
    return { harness, component, root, click, buttonByText };
  };

  beforeEach(() => localStorage.clear());

  const names = (root: HTMLElement) =>
    Array.from(root.querySelectorAll('[data-testid="tree-node"] span:first-child')).map((el) => el.textContent?.trim());

  it('shows the dataset bundles as a tree and edits the selected one', async () => {
    const { root, click, harness } = await setup();
    expect(names(root)).toEqual(['Room', 'Construction']);

    click('[data-testid="tree-node"]', 1);
    const name = root.querySelector('[data-testid="bundle-name"]') as HTMLInputElement;
    expect(name.value).toBe('Construction');
    name.value = 'Building';
    name.dispatchEvent(new Event('input'));
    harness.detectChanges();

    expect(names(root)).toEqual(['Room', 'Building']);
    expect(root.querySelector('[data-test="draft-status"]')?.textContent).toContain('Draft autosaved');
  });

  it('adds catalog items, one-offs and sub-bundles to the selected bundle', async () => {
    const { root, click, buttonByText, harness } = await setup();
    const input = root.querySelector('[data-testid="add-catalog-input"]') as HTMLInputElement;
    input.value = 'wood, cake';
    buttonByText('Add catalog items').click();
    harness.detectChanges();
    click('[data-testid="add-one-off"]');

    expect(root.querySelectorAll('[data-testid="item-row"]')).toHaveLength(3);

    buttonByText('Add sub-bundle').click();
    harness.detectChanges();
    expect(names(root)).toEqual(['Room', 'Construction', 'New Bundle']);
  });

  it('warns about catalog ids that do not exist', async () => {
    const { root, buttonByText, harness } = await setup();
    const input = root.querySelector('[data-testid="add-catalog-input"]') as HTMLInputElement;
    input.value = 'nope';
    buttonByText('Add catalog items').click();
    harness.detectChanges();

    expect(root.querySelector('[role="status"]')?.textContent).toContain('Not in the catalog: nope');
    expect(root.querySelectorAll('[data-testid="item-row"]')).toHaveLength(0);
  });

  it('adds a bundle from the template', async () => {
    const { root, buttonByText, harness } = await setup();
    buttonByText('From template').click();
    harness.detectChanges();

    expect(names(root)).toEqual(['Room', 'Construction', 'New Bundle']);
    expect((root.querySelector('[data-testid="bundle-id"]') as HTMLInputElement).value).toBe('new_bundle');
    expect(root.querySelectorAll('[data-testid="item-row"]')).toHaveLength(3);
  });
});
