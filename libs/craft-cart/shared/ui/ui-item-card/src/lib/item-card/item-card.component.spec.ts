import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '@crafting-cart/shared/models';
import { ItemCardComponent } from './item-card.component';

const item: Item = {
  id: 'ancient-fruit',
  name: 'Ancient Fruit',
  description: 'It was dormant for eons.',
  imageUrl: 'https://example.com/ancient-fruit.png',
  links: [],
  ingredients: [],
  categories: [],
  tags: []
};

@Component({
  imports: [ItemCardComponent],
  template: `
    <lib-item-card [catalogItem]="item()">
      <button ngProjectAs="lib-item-card-footer" type="button">Add</button>
    </lib-item-card>
  `
})
class HostComponent {
  readonly item = signal(item);
}

describe('ItemCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('renders the item name and description', () => {
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('Ancient Fruit');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('It was dormant for eons.');
  });

  it('renders the image with the item name as alt text', () => {
    const img = element.querySelector('img');
    expect(img?.getAttribute('src')).toBe(item.imageUrl);
    expect(img?.getAttribute('alt')).toBe('Ancient Fruit');
  });

  it('hides the description when the item has none', () => {
    fixture.componentInstance.item.set({ ...item, description: '' });
    fixture.detectChanges();
    expect(element.querySelector('p')).toBeNull();
  });

  it('projects the footer content', () => {
    expect(element.querySelector('button')?.textContent).toBe('Add');
  });
});
