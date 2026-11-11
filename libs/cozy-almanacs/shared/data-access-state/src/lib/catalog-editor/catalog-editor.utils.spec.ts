import {
  formatIngredients,
  formatLinks,
  itemIdFromUrl,
  parseIngredients,
  parseLinks,
  toCatalogId,
  toItemUrl
} from './catalog-editor.utils';

describe('catalog editor utils', () => {
  it('makes snake case ids from names', () => {
    expect(toCatalogId(' Storage Chests ')).toBe('storage_chests');
    expect(toCatalogId('Mr. Qi\'s Plane')).toBe('mr_qi_s_plane');
  });

  it('strips the base url and derives an item id', () => {
    expect(toItemUrl(' https://stardewvalleywiki.com/Cherry_Bomb ', 'https://stardewvalleywiki.com/')).toBe(
      'Cherry_Bomb'
    );
    expect(itemIdFromUrl('Tools/Copper_Pan')).toBe('copper_pan');
  });

  it('round-trips ingredients, defaulting a missing quantity to 1', () => {
    const ingredients = [
      { id: 'copper_ore', quantity: 4 },
      { id: 'coal', quantity: 1 }
    ];
    expect(parseIngredients(formatIngredients(ingredients))).toEqual(ingredients);
    expect(parseIngredients('wood, stone:x, ')).toEqual([
      { id: 'wood', quantity: 1 },
      { id: 'stone', quantity: 1 }
    ]);
  });

  it('round-trips links, giving a bare url the text "Link"', () => {
    const links = [{ text: 'Wiki Link', url: 'https://stardewvalleywiki.com/Bomb' }];
    expect(parseLinks(formatLinks(links))).toEqual(links);
    expect(parseLinks('https://example.com\n')).toEqual([{ text: 'Link', url: 'https://example.com' }]);
  });
});
