import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { ShellComponentComponent } from './shell.component';
import { shellRoutes } from './shell.routing';

describe('ShellComponentComponent', () => {
  let component: ShellComponentComponent;
  let fixture: ComponentFixture<ShellComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponentComponent],
      providers: [provideRouter([]), getLocalStorageToken('TEST-')]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the header, content area and footer as one viewport-height frame', () => {
    const frame: HTMLElement = fixture.nativeElement.firstElementChild;
    const parts = Array.from(frame.children).map((child) => child.tagName.toLowerCase());

    expect(frame.classList).toContain('h-dvh');
    expect(parts).toEqual(['mat-toolbar', 'mat-drawer-container', 'footer']);
  });

  it('brands the frame as Cozy Almanacs and links to the Crafting Cart pages', () => {
    const element: HTMLElement = fixture.nativeElement;
    const links = Array.from(element.querySelectorAll('mat-toolbar a')).map((link) => [
      link.textContent?.trim(),
      link.getAttribute('href')
    ]);

    expect(element.querySelector('mat-toolbar')?.textContent).toContain('Cozy Almanacs');
    expect(element.querySelector('footer')?.textContent).toContain('Cozy Almanacs');
    expect(links).toEqual([
      ['Crafting Cart', '/crafting-cart'],
      ['Shopping List', '/crafting-cart/list']
    ]);
  });
});

describe('shellRoutes', () => {
  const children = shellRoutes[0].children ?? [];

  it('redirects the root to the Crafting Cart', () => {
    expect(children[0]).toEqual({ path: '', pathMatch: 'full', redirectTo: 'crafting-cart' });
  });

  it('nests the catalog, shopping list and catalog editor under crafting-cart', () => {
    const craftingCart = children.find((route) => route.path === 'crafting-cart');

    expect(craftingCart?.children?.map((route) => route.path)).toEqual(['', 'list', 'config', 'config/:datasetId']);
  });
});
