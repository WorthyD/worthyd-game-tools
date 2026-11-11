import { ItemCardComponent } from './item-card.component';

describe(ItemCardComponent.name, () => {
  it('renders', () => {
    cy.mount(ItemCardComponent, {
      componentInputs: {
        catalogItem: {
          id: 'ancient-fruit',
          name: 'Ancient Fruit',
          description: 'It was dormant for eons.',
          imageUrl: 'https://example.com/ancient-fruit.png',
          links: [],
          ingredients: [],
          categories: [],
          tags: []
        }
      }
    });
    cy.contains('h3', 'Ancient Fruit');
  });
});
