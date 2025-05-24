import { TestBed } from '@angular/core/testing';
import { ItemCardComponent } from './item-card.component';

describe(ItemCardComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(ItemCardComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(ItemCardComponent);
  });
});
