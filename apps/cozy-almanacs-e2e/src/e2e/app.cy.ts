import { getGameCards, getToolbar } from '../support/app.po';

describe('cozy-almanacs-e2e', () => {
  describe('landing page', () => {
    beforeEach(() => cy.visit('/'));

    it('shows the landing page at the root', () => {
      cy.location('pathname').should('eq', '/');
      cy.get('h1').should('contain', 'cozy almanac');
      cy.get('mat-toolbar').should('not.exist');
    });

    it('links Stardew Valley to its subdomain', () => {
      getGameCards()
        .contains('[data-testid="game-card"]', 'Stardew Valley')
        .find('[data-testid="game-link"]')
        .should('have.attr', 'href', 'https://stardew-valley.cozyalmanacs.com');
    });
  });

  describe('crafting cart', () => {
    beforeEach(() => cy.visit('/crafting-cart'));

    it('opens inside the app shell', () => {
      getToolbar().contains('Cozy Almanacs');
    });

    it('navigates to the shopping list', () => {
      getToolbar().contains('a', 'Shopping List').click();
      cy.location('pathname').should('eq', '/crafting-cart/list');
    });
  });
});
