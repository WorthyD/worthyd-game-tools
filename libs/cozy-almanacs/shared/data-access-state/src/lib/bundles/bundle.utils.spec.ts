import { Bundle, Item } from '@cozy-almanacs/models';
import {
  bundleAt,
  compactBundle,
  compactBundleItem,
  filterCatalogItems,
  flattenBundles,
  moveEntry,
  resolveBundles,
  updateBundleAt
} from './bundle.utils';

const item = (id: string, categories: string[] = [], tags: string[] = []): Item => ({
  id,
  name: id.toUpperCase(),
  description: `${id} description`,
  imageUrl: `./images/${id}.png`,
  links: [{ text: 'Wiki', url: `https://wiki/${id}` }],
  ingredients: [],
  categories,
  tags
});

const catalog = [item('wood', ['raw']), item('stone', ['raw']), item('cake', ['cooking'], ['sweet'])];

describe('bundle utils', () => {
  it('filters catalog items by any listed category and any listed tag', () => {
    expect(filterCatalogItems(catalog, { categories: ['raw'] }).map(({ id }) => id)).toEqual(['wood', 'stone']);
    expect(filterCatalogItems(catalog, { tags: ['sweet'] }).map(({ id }) => id)).toEqual(['cake']);
    expect(filterCatalogItems(catalog, { categories: ['raw'], tags: ['sweet'] })).toEqual([]);
    expect(filterCatalogItems(catalog, {})).toEqual([]);
  });

  it('fills catalog items in and keeps one-offs as written', () => {
    const [bundle] = resolveBundles(
      [
        {
          id: 'b',
          name: 'B',
          items: [
            { itemId: 'wood', quantity: 99 },
            { id: 'note_1', name: 'Secret Note #1', imageUrl: './note.png' }
          ]
        }
      ],
      catalog,
      {}
    );

    expect(bundle.items).toEqual([
      expect.objectContaining({ key: 'wood', progressKey: 'b/wood', itemId: 'wood', name: 'WOOD', quantity: 99 }),
      expect.objectContaining({ key: 'note_1', itemId: undefined, name: 'Secret Note #1', imageUrl: './note.png' })
    ]);
  });

  it('adds filtered catalog items after the listed ones without repeating them', () => {
    const [bundle] = resolveBundles(
      [{ id: 'b', name: 'B', items: [{ itemId: 'stone' }], itemFilter: { categories: ['raw'] } }],
      catalog,
      {}
    );
    expect(bundle.items.map(({ key }) => key)).toEqual(['stone', 'wood']);
  });

  it('counts collected items up to `required` and rolls totals up through child bundles', () => {
    const bundles: Bundle[] = [
      {
        id: 'room',
        name: 'Room',
        bundles: [
          { id: 'a', name: 'A', required: 1, items: [{ itemId: 'wood' }, { itemId: 'stone' }] },
          { id: 'b', name: 'B', items: [{ itemId: 'cake' }] }
        ]
      }
    ];
    const [room] = resolveBundles(bundles, catalog, {
      'a/wood': { collected: true },
      'a/stone': { turnedIn: true }
    });

    expect(room.bundles[0]).toEqual(
      expect.objectContaining({ required: 1, collected: 1, turnedIn: 1, complete: true })
    );
    expect(room.bundles[1].complete).toBe(false);
    expect(room).toEqual(expect.objectContaining({ complete: false, totalRequired: 2, totalCollected: 1 }));
  });

  it('never marks an empty bundle complete', () => {
    const [empty] = resolveBundles([{ id: 'e', name: 'E', itemFilter: { categories: ['none'] } }], catalog, {});
    expect(empty.complete).toBe(false);
  });

  it('finds, updates and flattens nested bundles by path', () => {
    const bundles: Bundle[] = [{ id: 'a', name: 'A', bundles: [{ id: 'b', name: 'B' }] }];
    expect(bundleAt(bundles, [0, 0])?.id).toBe('b');
    const updated = updateBundleAt(bundles, [0, 0], (b) => ({ ...b, name: 'Renamed' }));
    expect(bundleAt(updated, [0, 0])?.name).toBe('Renamed');
    expect(bundles[0].bundles?.[0].name).toBe('B');
    expect(flattenBundles(updated).map(({ id }) => id)).toEqual(['a', 'b']);
  });

  it('moves entries and ignores moves past either end', () => {
    expect(moveEntry(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    expect(moveEntry(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
  });

  it('drops empty optional fields', () => {
    expect(compactBundleItem({ id: 'wood', itemId: 'wood', name: ' ', quantity: 1, links: [] })).toEqual({
      itemId: 'wood'
    });
    expect(
      compactBundle({
        id: 'a',
        name: 'A',
        description: '',
        items: [],
        bundles: [],
        itemFilter: { categories: [], tags: ['x'] },
        required: 0
      })
    ).toEqual({ id: 'a', name: 'A', itemFilter: { tags: ['x'] } });
  });
});
