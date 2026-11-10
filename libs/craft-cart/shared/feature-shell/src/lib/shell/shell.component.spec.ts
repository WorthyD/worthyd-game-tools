import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { ShellComponentComponent } from './shell.component';

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
});
