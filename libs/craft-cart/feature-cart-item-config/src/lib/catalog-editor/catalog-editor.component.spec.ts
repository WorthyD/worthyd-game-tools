import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { BehaviorSubject } from 'rxjs';
import { CatalogDataset } from '@crafting-cart/shared/models';
import { CatalogEditorStore, catalogEditorStorageKey, provideCatalogDatasets } from '@crafting-cart/state';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CatalogEditorComponent } from './catalog-editor.component';

describe('CatalogEditorComponent', () => {
  let fixture: ComponentFixture<CatalogEditorComponent>;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const dataset: CatalogDataset = {
    id: 'stardew',
    name: 'Stardew Valley',
    config: {
      baseUrl: 'https://stardewvalleywiki.com/',
      assetPath: './images/',
      imagePath: './scrapers/images/',
      configOutputPath: './scrapers/stardew-output.ts',
      categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }],
      tags: [{ id: 'bombs', name: 'Bombs', icon: 'bomb' }],
      items: [{ itemUrl: 'Bomb', itemId: 'bomb', categories: ['crafting'], tags: ['bombs'] }]
    },
    items: [
      {
        id: 'bomb',
        name: 'Bomb',
        description: 'Generates an explosion.',
        imageUrl: './images/bomb.png',
        links: [],
        ingredients: [],
        categories: ['crafting'],
        tags: ['bombs']
      }
    ],
    files: { config: 'apps/craft-cart/src/app/catalog/config.ts', items: 'apps/craft-cart/src/app/catalog/items.ts' }
  };

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const store = () => fixture.debugElement.injector.get(CatalogEditorStore);

  const create = () => {
    fixture = TestBed.createComponent(CatalogEditorComponent);
    fixture.detectChanges();
  };

  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({}));
    TestBed.configureTestingModule({
      imports: [CatalogEditorComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        getLocalStorageToken('TEST-'),
        provideCatalogDatasets([dataset]),
        { provide: ActivatedRoute, useValue: { paramMap: params } }
      ]
    });
  });

  afterEach(() => localStorage.clear());

  it('opens the first dataset when no dataset id is in the url', () => {
    create();

    expect(text()).toContain('Stardew Valley');
    expect(text()).toContain('No changes from the source files');
    expect(text()).toContain('Item configs (1)');
    expect(text()).toContain('Catalog items (1)');
  });

  it('says so when the dataset id is unknown', () => {
    params.next(convertToParamMap({ datasetId: 'terraria' }));
    create();

    expect(text()).toContain('There is no catalog dataset called "terraria"');
  });

  it('shows autosave status and restores the draft on the next visit', () => {
    create();
    store().updateItem(0, { name: 'Big Bomb' });
    fixture.detectChanges();
    expect(text()).toContain('Draft autosaved');
    expect(localStorage.getItem(`TEST-${catalogEditorStorageKey('stardew')}`)).toContain('Big Bomb');

    fixture.destroy();
    create();
    expect(fixture.nativeElement.querySelector('[data-test="restored-banner"]')).toBeTruthy();
    expect(store().draft()?.items[0].name).toBe('Big Bomb');
  });

  it('renames a label from the labels tab', () => {
    create();
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input[aria-label="Name of bombs"]');
    nameInput.value = 'Explosives';
    nameInput.dispatchEvent(new Event('input'));

    expect(store().draft()?.config.tags[0].name).toBe('Explosives');
  });

  it('shows the generated files and their issues on the export tab', async () => {
    create();
    store().updateItem(0, { tags: ['missing'] });
    const tabs = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: /Export/ });

    expect(text()).toContain('apps/craft-cart/src/app/catalog/config.ts');
    expect(text()).toContain("Catalog items use tags that aren't defined: missing");
    const files = [...fixture.nativeElement.querySelectorAll('textarea[readonly]')] as HTMLTextAreaElement[];
    expect(files[1].value).toContain("tags: ['missing']");
  });
});
