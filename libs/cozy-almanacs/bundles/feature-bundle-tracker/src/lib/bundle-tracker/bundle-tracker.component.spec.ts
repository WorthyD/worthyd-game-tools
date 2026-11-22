import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Item } from '@cozy-almanacs/models';
import { BundleStore, CartStore, CatalogStore } from '@cozy-almanacs/state';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { BundleTrackerComponent } from './bundle-tracker.component';

const wood: Item = {
  id: 'wood',
  name: 'Wood',
  description: 'A sturdy material.',
  imageUrl: './images/wood.png',
  links: [{ text: 'Wiki', url: 'https://wiki/Wood' }],
  ingredients: [],
  categories: [],
  tags: []
};

describe('BundleTrackerComponent', () => {
  const setup = async (url = '/bundles') => {
    TestBed.configureTestingModule({
      providers: [
        getLocalStorageToken('TRACKER-TEST-'),
        provideRouter([
          { path: 'bundles', component: BundleTrackerComponent },
          { path: 'bundles/:bundleId', component: BundleTrackerComponent }
        ])
      ]
    });
    TestBed.inject(CatalogStore).init([wood]);
    TestBed.inject(BundleStore).init('game', [
      {
        id: 'crafts_room',
        name: 'Crafts Room',
        bundles: [
          {
            id: 'construction',
            name: 'Construction',
            required: 1,
            items: [
              { itemId: 'wood', quantity: 99 },
              { id: 'note_1', name: 'Secret Note #1' }
            ]
          }
        ]
      },
      { id: 'notes', name: 'Secret Notes', items: [{ id: 'note_1', name: 'Secret Note #1' }] }
    ]);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return harness;
  };

  beforeEach(() => localStorage.clear());

  const text = (root: HTMLElement, selector: string) =>
    Array.from(root.querySelectorAll(selector)).map((el) => el.textContent?.trim());

  it('lists the top-level bundles and shows the first one', async () => {
    const harness = await setup();
    const root: HTMLElement = harness.routeNativeElement as HTMLElement;

    expect(text(root, 'nav [matListItemTitle]')).toEqual(['Crafts Room', 'Secret Notes']);
    expect(root.querySelector('main h1')?.textContent).toContain('Crafts Room');
    expect(text(root, '[data-testid="item-name"]')).toEqual(['Wood', 'Secret Note #1']);
    expect(root.textContent).toContain('Any 1 of these 2.');
  });

  it('shows the bundle named in the url', async () => {
    const harness = await setup('/bundles/notes');
    expect((harness.routeNativeElement as HTMLElement).querySelector('main h1')?.textContent).toContain('Secret Notes');
  });

  it('checks off items, turns them in and adds catalog items to the cart', async () => {
    const harness = await setup();
    const root = harness.routeNativeElement as HTMLElement;
    const store = TestBed.inject(BundleStore);

    (root.querySelector('[data-testid="collected"] input') as HTMLInputElement).click();
    harness.detectChanges();
    expect(store.progress()).toEqual({ 'construction/wood': { collected: true } });
    expect(
      root.querySelector('[data-testid="bundle-construction"] [data-testid="bundle-count"]')?.textContent?.trim()
    ).toBe('1 / 1');

    (root.querySelectorAll('[data-testid="turned-in"]')[1] as HTMLButtonElement).click();
    expect(store.progress()['construction/note_1']).toEqual({ collected: true, turnedIn: true });

    expect(root.querySelectorAll('[data-testid="add-to-cart"]')).toHaveLength(1);
    (root.querySelector('[data-testid="add-to-cart"]') as HTMLButtonElement).click();
    expect(TestBed.inject(CartStore).entityMap()['wood']).toEqual({ itemId: 'wood', quantity: 99 });
  });

  it('hides collected items when asked', async () => {
    const harness = await setup();
    const root = harness.routeNativeElement as HTMLElement;
    TestBed.inject(BundleStore).setCollected('construction/wood', true);
    (root.querySelector('mat-slide-toggle button') as HTMLButtonElement).click();
    harness.detectChanges();

    expect(text(root, '[data-testid="item-name"]')).toEqual(['Secret Note #1']);
  });

  it('points to the editor when there are no bundles', async () => {
    const harness = await setup();
    TestBed.inject(BundleStore).init('empty', []);
    harness.detectChanges();
    expect((harness.routeNativeElement as HTMLElement).querySelector('[data-testid="empty"]')?.textContent).toContain(
      'There are no bundles to track yet.'
    );
  });
});
