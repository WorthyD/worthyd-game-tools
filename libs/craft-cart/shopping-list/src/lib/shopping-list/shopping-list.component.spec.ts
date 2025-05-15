import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingListComponent } from './shopping-list.component';
import { CartEntity, CartFacade, CatalogFacade } from '@crafting-cart/state';
import { Item } from '@crafting-cart/models';
import { provideMockStore } from '@ngrx/store/testing';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListComponent],
      providers: [CatalogFacade, CartFacade, provideMockStore({})]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get raw items', () => {
    const items = [
      { itemId: '1', quantity: 2 },
      { itemId: '2', quantity: 1 }
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
      { id: '3', ingredients: [] }
    ] as Item[];

    const rawItems = component.getRawItems(items, catalogItems);

    expect(rawItems.length).toBe(2);

    console.log(rawItems);
    const item1 = rawItems.find((x) => x.item.id === '1');
    expect(item1).toBeFalsy();

    const item2 = rawItems.find((x) => x.item.id === '2');
    expect(item2?.quantity).toEqual(2);

    const item3 = rawItems.find((x) => x.item.id === '3');
    expect(item3?.quantity).toEqual(6);
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
    ] as Item[];

    const rawItems = component.getRawItems(items, catalogItems);

    expect(rawItems.length).toBe(1);

    console.log(rawItems);
    const item1 = rawItems.find((x) => x.item.id === '1');
    expect(item1).toBeFalsy();

    const item2 = rawItems.find((x) => x.item.id === '2');
    expect(item2?.quantity).toEqual(4);

  });
});
