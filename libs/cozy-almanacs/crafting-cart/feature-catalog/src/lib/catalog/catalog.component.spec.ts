import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogStore } from '@cozy-almanacs/state';
import { Item } from '@cozy-almanacs/models';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CatalogComponent } from './catalog.component';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [getLocalStorageToken('TEST-')]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a links menu next to the name of items that have links', () => {
    const makeItem = (id: string, name: string, links: Item['links']): Item => ({
      id,
      name,
      description: '',
      imageUrl: '',
      links,
      ingredients: [],
      categories: [],
      tags: []
    });
    TestBed.inject(CatalogStore).init([
      makeItem('chest', 'Chest', [{ text: 'Wiki', url: 'https://example.com/wiki/Chest' }]),
      makeItem('wood', 'Wood', [])
    ]);
    fixture.detectChanges();

    const triggers = fixture.nativeElement.querySelectorAll('[data-testid="item-links-trigger"]');
    expect(Array.from(triggers as NodeListOf<HTMLElement>).map((t) => t.getAttribute('aria-label'))).toEqual([
      'Links for Chest'
    ]);
  });
});
