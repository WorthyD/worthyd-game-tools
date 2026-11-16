import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { Item } from '@cozy-almanacs/models';
import { ItemLinksMenuComponent } from './item-links-menu.component';

type LinkedItem = Pick<Item, 'name' | 'links'>;

const item: LinkedItem = {
  name: 'Ancient Fruit',
  links: [
    { text: 'Wiki', url: 'https://example.com/wiki/Ancient_Fruit' },
    { text: '', url: 'https://example.com/guide' }
  ]
};

@Component({
  imports: [ItemLinksMenuComponent],
  template: `<lib-item-links-menu [item]="item()" />`
})
class HostComponent {
  readonly item = signal<LinkedItem>(item);
}

describe('ItemLinksMenuComponent', () => {
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

  const openMenu = async () => {
    const menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);
    await menu.open();
    return menu;
  };

  it('renders a labelled trigger button', () => {
    const trigger = element.querySelector('[data-testid="item-links-trigger"]');
    expect(trigger?.getAttribute('aria-label')).toBe('Links for Ancient Fruit');
  });

  it('lists each link, falling back to the url when it has no text', async () => {
    const menu = await openMenu();
    const items = await menu.getItems();
    const texts = await Promise.all(items.map((menuItem) => menuItem.getText()));

    expect(texts).toEqual([expect.stringMatching(/^Wiki/), expect.stringMatching(/^https:\/\/example\.com\/guide/)]);
    texts.forEach((text) => expect(text).toContain('(opens in a new tab)'));
  });

  it('opens links in a new tab without sharing the opener', async () => {
    await openMenu();
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-testid="item-link"]'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual(item.links.map((link) => link.url));
    links.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.querySelector('mat-icon')?.textContent).toBe('open_in_new');
    });
  });

  it('renders nothing when the item has no links', () => {
    fixture.componentInstance.item.set({ ...item, links: [] });
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeNull();
  });
});
