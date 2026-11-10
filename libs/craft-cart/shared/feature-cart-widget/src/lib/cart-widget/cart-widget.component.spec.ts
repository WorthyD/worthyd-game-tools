import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartStore } from '@crafting-cart/state';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { CartWidgetComponent } from './cart-widget.component';

describe('CartWidgetComponent', () => {
  let component: CartWidgetComponent;
  let fixture: ComponentFixture<CartWidgetComponent>;
  let cart: InstanceType<typeof CartStore>;
  let el: HTMLElement;

  const lines = () => el.querySelectorAll('[data-testid="cart-line"]');
  const summary = () => el.querySelector('[data-testid="cart-summary"]')?.textContent?.trim();
  const button = (label: string) => el.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CartWidgetComponent],
      providers: [provideRouter([]), getLocalStorageToken('TEST-')]
    }).compileComponents();

    fixture = TestBed.createComponent(CartWidgetComponent);
    component = fixture.componentInstance;
    cart = TestBed.inject(CartStore);
    el = fixture.nativeElement;
    cart.emptyCart();
    fixture.detectChanges();
  });

  it('shows an empty state when the cart has no items', () => {
    expect(lines().length).toBe(0);
    expect(el.textContent).toContain('Your cart is empty');
    expect(summary()).toBe('No items yet');
  });

  it('lists cart lines and summarises item and unit counts', () => {
    cart.addItemToCart({ itemId: 'a', quantity: 1 });
    cart.addItemToCart({ itemId: 'b', quantity: 3 });
    fixture.detectChanges();

    expect(lines().length).toBe(2);
    expect(summary()).toBe('2 items · 4 total');
  });

  it('steps the quantity up and down but not below one', () => {
    cart.addItemToCart({ itemId: 'a', quantity: 1 });
    fixture.detectChanges();

    expect(button('Decrease Unknown item')?.disabled).toBe(true);

    button('Increase Unknown item')?.click();
    fixture.detectChanges();
    expect(cart.entityMap()['a']?.quantity).toBe(2);

    button('Decrease Unknown item')?.click();
    fixture.detectChanges();
    expect(cart.entityMap()['a']?.quantity).toBe(1);
  });

  it('ignores an invalid typed quantity and restores the last value', () => {
    cart.addItemToCart({ itemId: 'a', quantity: 2 });
    fixture.detectChanges();

    const input = el.querySelector<HTMLInputElement>('input[type="number"]');
    if (!input) throw new Error('quantity input missing');
    input.value = '0';
    input.dispatchEvent(new Event('change'));

    expect(cart.entityMap()['a']?.quantity).toBe(2);
    expect(input.value).toBe('2');
  });

  it('removes a line and empties the cart', () => {
    cart.addItemToCart({ itemId: 'a', quantity: 1 });
    cart.addItemToCart({ itemId: 'b', quantity: 1 });
    fixture.detectChanges();

    el.querySelector<HTMLButtonElement>('button[aria-label="Remove Unknown item"]')?.click();
    fixture.detectChanges();
    expect(lines().length).toBe(1);

    Array.from(el.querySelectorAll('button'))
      .find((b) => b.textContent?.includes('Empty cart'))
      ?.click();
    fixture.detectChanges();
    expect(lines().length).toBe(0);
  });

  it('asks the drawer to close from the close button', () => {
    const closed = jest.fn();
    component.closed.subscribe(closed);

    button('Close cart')?.click();

    expect(closed).toHaveBeenCalledTimes(1);
  });
});
