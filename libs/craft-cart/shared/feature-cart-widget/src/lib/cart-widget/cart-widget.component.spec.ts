import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CartWidgetComponent } from './cart-widget.component';

describe('CartWidgetComponent', () => {
  let component: CartWidgetComponent;
  let fixture: ComponentFixture<CartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartWidgetComponent],
      providers: [provideRouter([]), getLocalStorageToken('TEST-')]
    }).compileComponents();

    fixture = TestBed.createComponent(CartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
