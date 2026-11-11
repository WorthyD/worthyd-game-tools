import { Item, ItemLabel } from '@cozy-almanacs/models';
import { filterByLabels, labelOptions, toLabelText } from './catalog-filters';

const categories: ItemLabel[] = [
  { id: 'crafting', name: 'Crafting', icon: 'handyman' },
  { id: 'raw', name: 'Raw_Materials', icon: 'forest' },
  { id: 'cooking', name: 'Cooking', icon: 'skillet' }
];
const tags: ItemLabel[] = [
  { id: 'bombs', name: 'Bombs', icon: 'bomb' },
  { id: 'artisan', name: 'Artisan_Equipment', icon: 'wine_bar' },
  { id: 'unused', name: 'Unused', icon: 'block' }
];

const makeItem = (id: string, categoryIds: string[], tagIds: string[]): Item => ({
  id,
  name: id,
  description: '',
  imageUrl: '',
  links: [],
  ingredients: [],
  categories: categoryIds,
  tags: tagIds
});

const items = [
  makeItem('bomb', ['crafting'], ['bombs']),
  makeItem('keg', ['crafting'], ['artisan']),
  makeItem('salad', ['cooking'], []),
  makeItem('mega_bomb', ['crafting'], ['bombs', 'artisan'])
];

describe('catalog filters', () => {
  it('formats config names as labels', () => {
    expect(toLabelText('Artisan_Equipment')).toBe('Artisan Equipment');
  });

  it('lists only the labels items use, in config order, with their icons', () => {
    expect(labelOptions(categories, items, 'categories')).toEqual([
      { id: 'crafting', name: 'Crafting', icon: 'handyman', label: 'Crafting' },
      { id: 'cooking', name: 'Cooking', icon: 'skillet', label: 'Cooking' }
    ]);
    expect(labelOptions(tags, items, 'tags').map((tag) => tag.id)).toEqual(['bombs', 'artisan']);
  });

  it('returns every item when nothing is selected', () => {
    expect(filterByLabels(items, [], [])).toEqual(items);
  });

  it('matches any selected label within a group', () => {
    const ids = filterByLabels(items, ['crafting', 'cooking'], []).map((item) => item.id);
    expect(ids).toEqual(['bomb', 'keg', 'salad', 'mega_bomb']);
  });

  it('requires a match in both groups when both have a selection', () => {
    const ids = filterByLabels(items, ['crafting'], ['artisan']).map((item) => item.id);
    expect(ids).toEqual(['keg', 'mega_bomb']);
  });
});
