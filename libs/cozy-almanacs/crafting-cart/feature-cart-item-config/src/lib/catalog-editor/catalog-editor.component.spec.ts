import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { BehaviorSubject } from 'rxjs';
import { CatalogDataset } from '@cozy-almanacs/models';
import { CatalogEditorStore, catalogEditorStorageKey, provideCatalogDatasets } from '@cozy-almanacs/state';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CatalogEditorComponent } from './catalog-editor.component';

describe('CatalogEditorComponent', () => {
  let fixture: ComponentFixture<CatalogEditorComponent>;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const dataset: CatalogDataset = {
    id: 'stardew',
    name: 'Stardew Valley',
    config: {
      tags: [{ id: 'bombs', name: 'Bombs', icon: 'bomb' }],
      categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }]
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
    files: {
      config: 'apps/cozy-almanacs/src/app/catalog/config.ts',
      items: 'apps/cozy-almanacs/src/app/catalog/items.ts'
    }
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
    expect(text()).toContain('Catalog items (1)');
  });

  it('has no scraper settings or item configs', () => {
    create();

    expect(text()).toContain('Labels');
    expect(text()).not.toContain('Item configs');
    expect(text()).not.toContain('Base URL');
    expect(text()).not.toContain('Scraper');
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

  it('edits an item ingredient quantity from the catalog items tab', async () => {
    create();
    store().updateItem(0, { ingredients: [{ id: 'bomb', quantity: 2 }] });
    const tabs = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: /Catalog items/ });
    const quantity: HTMLInputElement = fixture.nativeElement.querySelector('input[aria-label="Quantity of Bomb"]');
    quantity.value = '5';
    quantity.dispatchEvent(new Event('change'));

    expect(store().draft()?.items[0].ingredients).toEqual([{ id: 'bomb', quantity: 5 }]);
  });

  it('adds items from pasted wiki urls on the catalog items tab', async () => {
    create();
    const tabs = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: /Catalog items/ });
    const urls: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea[aria-label="Wiki urls"]');
    urls.value = 'https://stardewvalleywiki.com/Cherry_Bomb\nhttps://stardewvalleywiki.com/Bomb';
    const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLButtonElement) =>
      b.textContent?.includes('Add from urls')
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(
      store()
        .draft()
        ?.items.map(({ id }) => id)
    ).toEqual(['bomb', 'cherry_bomb']);
    expect(urls.value).toBe('');
    expect(text()).toContain('Added 1 item.');
  });

  it('adds several items from the add items dialog', async () => {
    create();
    const tabs = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: /Catalog items/ });
    const open = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLButtonElement) =>
      b.textContent?.includes('Add up to 5 items')
    ) as HTMLButtonElement;
    open.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = document.querySelector('lib-add-items-dialog') as HTMLElement;
    expect(dialog).toBeTruthy();
    ['Cherry Bomb', 'Mega Bomb'].forEach((name, i) => {
      const input = dialog.querySelector(`[aria-label="Name of new item ${i + 1}"]`) as HTMLInputElement;
      input.value = name;
      input.dispatchEvent(new Event('input'));
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const add = [...dialog.querySelectorAll('button')].find((b) => b.textContent?.includes('Add 2 items'));
    add?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      store()
        .draft()
        ?.items.map(({ id }) => id)
    ).toEqual(['bomb', 'cherry_bomb', 'mega_bomb']);
    expect(text()).toContain('Added 2 items.');
  });

  it('shows the generated files and their issues on the export tab', async () => {
    create();
    store().updateItem(0, { tags: ['missing'] });
    const tabs = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: /Export/ });

    expect(text()).toContain('apps/cozy-almanacs/src/app/catalog/config.ts');
    expect(text()).toContain("Catalog items use tags that aren't defined: missing");
    const files = [...fixture.nativeElement.querySelectorAll('textarea[readonly]')] as HTMLTextAreaElement[];
    expect(files[1].value).toContain("tags: ['missing']");
  });
});
