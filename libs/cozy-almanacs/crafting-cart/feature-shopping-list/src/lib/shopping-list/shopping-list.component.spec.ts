import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { ShoppingListComponent, SHOPPING_LIST_STORAGE_KEY } from './shopping-list.component';
import { CartEntity, CartStore, CatalogStore } from '@cozy-almanacs/state';
import { Item } from '@cozy-almanacs/models';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';

const PREFIX = 'TEST-';

const makeItem = (id: string, name: string, ingredients: Item['ingredients'] = []): Item => ({
  id,
  name,
  description: '',
  imageUrl: '',
  links: [],
  ingredients,
  categories: [],
  tags: []
});

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  const setup = () => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const rowNames = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[data-testid="list-row"]') as NodeListOf<HTMLElement>).map(
      (row) =>
        ['row-name', 'row-qty']
          .map((id) => row.querySelector(`[data-testid="${id}"]`)?.textContent?.trim() ?? '')
          .join(' ')
    );

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ShoppingListComponent],
      providers: [getLocalStorageToken(PREFIX), provideRouter([])]
    }).compileComponents();
  });

  describe('with a cart', () => {
    beforeEach(() => {
      TestBed.inject(CatalogStore).init([
        makeItem('chest', 'Chest', [{ id: 'wood', quantity: 50 }]),
        makeItem('sprinkler', 'Sprinkler', [
          { id: 'copper', quantity: 1 },
          { id: 'iron', quantity: 1 }
        ]),
        makeItem('wood', 'Wood'),
        makeItem('copper', 'Copper Bar'),
        makeItem('iron', 'Iron Bar')
      ]);
      const cart = TestBed.inject(CartStore);
      cart.addItemToCart({ itemId: 'chest', quantity: 2 });
      cart.addItemToCart({ itemId: 'sprinkler', quantity: 3 });
      setup();
    });

    it('lists the cart items by default', () => {
      expect(component.view()).toBe('cart');
      expect(rowNames()).toEqual(['Chest ×2', 'Sprinkler ×3']);
    });

    it('switches to the raw resources', async () => {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const raw = await loader.getHarness(MatButtonToggleHarness.with({ text: 'Raw resources' }));
      await raw.check();

      expect(component.view()).toBe('raw');
      expect(rowNames()).toEqual(['Wood ×100', 'Copper Bar ×3', 'Iron Bar ×3']);
    });

    it('checks off rows and reports progress', async () => {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const [chest] = await loader.getAllHarnesses(MatCheckboxHarness);
      await chest.check();

      const summary = fixture.nativeElement.querySelector('[data-testid="list-summary"]') as HTMLElement;
      expect(summary.textContent).toContain('1 of 2 items checked off');
      expect(fixture.nativeElement.querySelector('.is-checked')?.textContent).toContain('Chest');
    });

    it('keeps check-offs separate per view', () => {
      component.toggleChecked('chest', true);
      component.view.set('raw');
      expect(component.checkedCount()).toBe(0);

      component.view.set('cart');
      expect(component.checkedCount()).toBe(1);
    });

    it('unchecks everything in the current view', () => {
      component.toggleChecked('chest', true);
      component.toggleChecked('sprinkler', true);
      expect(component.summary()).toBe('All done!');

      component.clearChecked();
      expect(component.checkedCount()).toBe(0);
    });

    it('remembers the view and check-offs in local storage', () => {
      component.view.set('raw');
      component.toggleChecked('wood', true);
      fixture.detectChanges();

      expect(JSON.parse(localStorage.getItem(PREFIX + SHOPPING_LIST_STORAGE_KEY) ?? '{}')).toEqual({
        view: 'raw',
        checked: { cart: [], raw: ['wood'] }
      });
    });
  });

  it('restores the saved view and check-offs', () => {
    localStorage.setItem(
      PREFIX + SHOPPING_LIST_STORAGE_KEY,
      JSON.stringify({ view: 'raw', checked: { cart: [], raw: ['wood'] } })
    );
    TestBed.inject(CatalogStore).init([makeItem('wood', 'Wood')]);
    TestBed.inject(CartStore).addItemToCart({ itemId: 'wood', quantity: 5 });
    setup();

    expect(component.view()).toBe('raw');
    expect(component.rows()).toEqual([expect.objectContaining({ quantity: 5, checked: true })]);
  });

  it('shows an empty state when the cart is empty', () => {
    setup();
    expect(fixture.nativeElement.textContent).toContain('Nothing to gather yet');
    expect(fixture.nativeElement.querySelector('[data-testid="list-row"]')).toBeNull();
  });

  describe('getRawItems', () => {
    beforeEach(() => setup());

    it('should get raw items', () => {
      const items = [
        { itemId: '1', quantity: 2 },
        { itemId: '2', quantity: 1 },
        { itemId: '4', quantity: 37 }
      ] as CartEntity[];

      const catalogItems = [
        {
          id: '1',
          ingredients: [
            { id: '2', quantity: 1 },
            { id: '3', quantity: 2 }
          ]
        },
        { id: '2', ingredients: [{ id: '3', quantity: 2 }] },
        { id: '3', ingredients: [] },
        { id: '4', ingredients: [] }
      ] as unknown as Item[];

      const rawItems = component.getRawItems(items, catalogItems);

      expect(rawItems.length).toBe(3);
      expect(rawItems.find((x) => x.item.id === '1')).toBeFalsy();
      expect(rawItems.find((x) => x.item.id === '2')?.quantity).toEqual(2);
      expect(rawItems.find((x) => x.item.id === '3')?.quantity).toEqual(6);
      expect(rawItems.find((x) => x.item.id === '4')?.quantity).toEqual(37);
    });

    it('should get raw items ids', () => {
      const items = [{ itemId: '1', quantity: 2 }] as CartEntity[];

      const catalogItems = [
        {
          id: '1',
          ingredients: [{ id: '2', quantity: 2 }]
        },
        { id: '2', ingredients: [{ id: '3', quantity: 2 }] },
        { id: '3', ingredients: [] }
      ] as unknown as Item[];

      const rawItems = component.getRawItems(items, catalogItems);

      expect(rawItems.length).toBe(1);
      expect(rawItems.find((x) => x.item.id === '1')).toBeFalsy();
      expect(rawItems.find((x) => x.item.id === '2')?.quantity).toEqual(4);
    });
  });
});
