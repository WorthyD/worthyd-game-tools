import { TestBed } from '@angular/core/testing';
import { CartQuantityComponent } from './cart-quantity.component';

describe(CartQuantityComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(CartQuantityComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(CartQuantityComponent);
  });
});
