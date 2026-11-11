import { getToolbar } from '../support/app.po';

describe('cozy-almanacs-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('redirects the root to the Crafting Cart', () => {
    cy.location('pathname').should('eq', '/crafting-cart');
    getToolbar().contains('Cozy Almanacs');
  });

  it('navigates to the shopping list', () => {
    getToolbar().contains('a', 'Shopping List').click();
    cy.location('pathname').should('eq', '/crafting-cart/list');
  });
});
