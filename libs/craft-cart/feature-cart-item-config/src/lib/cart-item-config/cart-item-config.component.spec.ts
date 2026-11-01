import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartItemConfigComponent } from './cart-item-config.component';
import { ScraperConfigToken } from '@crafting-cart/shell';
import { ScraperConfig } from '@crafting-cart/shared/models';
import { MatChipInputEvent } from '@angular/material/chips';

describe('CartItemConfigComponent', () => {
  let component: CartItemConfigComponent;
  let fixture: ComponentFixture<CartItemConfigComponent>;

  const mockConfig: ScraperConfig = {
    baseUrl: 'http://example.com',
    imagePath: '/images',
    assetPath: '/assets',
    configOutputPath: '/output',
    tags: [{ name: 'Bombs', icon: 'local_fire_department' }],
    categories: [{ name: 'Crafting', icon: 'construction' }],
    items: [
      {
        itemUrl: 'http://example.com/item1',
        itemId: 'item1',
        categories: ['Crafting'],
        tags: ['Bombs']
      },
      {
        itemUrl: 'http://example.com/item2',
        itemId: 'item2',
        categories: [],
        tags: []
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CartItemConfigComponent,
        ReactiveFormsModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: ScraperConfigToken, useValue: mockConfig }, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with cloned config items', () => {
    expect(component.items.length).toBe(2);
    expect(component.items.at(0).get('itemUrl')?.value).toBe('http://example.com/item1');
    expect(component.items.at(0).get('itemId')?.value).toBe('item1');
  });

  it('should add a new row', () => {
    const initialLength = component.items.length;
    component.addRow();
    expect(component.items.length).toBe(initialLength + 1);
    expect(component.items.at(initialLength).get('itemUrl')?.value).toBe('');
    expect(component.items.at(initialLength).get('itemId')?.value).toBe('');
  });

  it('should remove a row', () => {
    const initialLength = component.items.length;
    component.removeRow(0);
    expect(component.items.length).toBe(initialLength - 1);
  });

  it('should load categories and tags with their icons', () => {
    expect(component.categories()).toEqual([{ name: 'Crafting', icon: 'construction' }]);
    expect(component.tags()).toEqual([{ name: 'Bombs', icon: 'local_fire_department' }]);
    expect(component.items.at(0).get('tags')?.value).toEqual(['Bombs']);
  });

  it('should add a tag with the default icon and keep the form in sync', () => {
    const chipInput = { clear: jest.fn() };
    component.addKeyword(
      { value: ' Fences ', chipInput } as unknown as MatChipInputEvent,
      component.tags,
      'tags',
      component.defaultTagIcon
    );

    const expected = [
      { name: 'Bombs', icon: 'local_fire_department' },
      { name: 'Fences', icon: 'label' }
    ];
    expect(component.tags()).toEqual(expected);
    expect(component.itemsForm.get('tags')?.value).toEqual(expected);
    expect(chipInput.clear).toHaveBeenCalled();
  });

  it('should not add a duplicate category', () => {
    const chipInput = { clear: jest.fn() };
    component.addKeyword(
      { value: 'Crafting', chipInput } as unknown as MatChipInputEvent,
      component.categories,
      'categories',
      component.defaultCategoryIcon
    );

    expect(component.categories()).toEqual([{ name: 'Crafting', icon: 'construction' }]);
  });

  it('should remove a category by name', () => {
    component.removeKeyword({ name: 'Crafting', icon: 'construction' }, component.categories, 'categories');

    expect(component.categories()).toEqual([]);
    expect(component.itemsForm.get('categories')?.value).toEqual([]);
  });
});
