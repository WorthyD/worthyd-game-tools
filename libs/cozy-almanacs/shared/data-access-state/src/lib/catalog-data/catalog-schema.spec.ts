import { CatalogDataset } from '@cozy-almanacs/models';
import {
  catalogBundlesIssues,
  catalogConfigIssues,
  catalogItemsIssues,
  catalogReferenceIssues
} from './catalog-schema';

const item = {
  id: 'bomb',
  name: 'Bomb',
  description: '',
  imageUrl: './images/bomb.png',
  links: [{ text: 'Wiki Link', url: 'https://example.com/Bomb' }],
  ingredients: [{ id: 'coal', quantity: 1 }],
  categories: ['crafting'],
  tags: ['bombs']
};

describe('catalog schema', () => {
  it('accepts valid files', () => {
    expect(
      catalogConfigIssues({ categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }], tags: [] })
    ).toEqual([]);
    expect(catalogItemsIssues([item])).toEqual([]);
    expect(
      catalogBundlesIssues([
        { id: 'room', name: 'Room', bundles: [{ id: 'b', name: 'B', items: [{ itemId: 'bomb', quantity: 2 }] }] }
      ])
    ).toEqual([]);
  });

  it('names each field with the wrong shape', () => {
    expect(catalogConfigIssues({ categories: [{ id: 'a', name: 'A' }] })).toEqual([
      'config.categories[0].icon is missing',
      'config.tags is missing'
    ]);
    expect(catalogItemsIssues([{ ...item, ingredients: [{ id: 'coal', quantity: '1' }], tags: 'bombs' }])).toEqual([
      'items[0].ingredients[0].quantity should be a number',
      'items[0].tags should be an array'
    ]);
    expect(catalogItemsIssues({})).toEqual(['items should be an array']);
    expect(
      catalogBundlesIssues([{ id: 'room', name: 'Room', bundles: [{ id: 'b', items: [{ quantity: 'x' }] }] }])
    ).toEqual(['bundles[0].bundles[0].name is missing', 'bundles[0].bundles[0].items[0].quantity should be a number']);
  });

  it('finds broken references between the files', () => {
    const dataset: CatalogDataset = {
      id: 'game',
      name: 'Game',
      config: { categories: [{ id: 'crafting', name: 'Crafting', icon: '' }], tags: [] },
      items: [item, item],
      bundles: [{ id: 'room', name: 'Room', items: [{ itemId: 'wood' }], itemFilter: { tags: ['seeds'] } }]
    };

    expect(catalogReferenceIssues(dataset)).toEqual([
      'Duplicate item ids: bomb',
      'Items use undefined tags: bombs',
      "Ingredients that aren't items: coal",
      "Bundle items that aren't catalog items: wood",
      'Bundle filters use undefined tags: seeds'
    ]);
  });
});
