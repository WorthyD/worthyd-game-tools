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
});
