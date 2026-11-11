import { TestBed } from '@angular/core/testing';
import { CartItemCardComponent } from './cart-item-card.component';

describe(CartItemCardComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(CartItemCardComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(CartItemCardComponent);
  });
});
