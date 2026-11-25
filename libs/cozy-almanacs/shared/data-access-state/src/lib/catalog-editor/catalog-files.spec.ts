import { Bundle, CatalogConfig, Item } from '@cozy-almanacs/models';
import { createBundlesFile, createConfigFile, createItemsFile } from './catalog-files';

describe('catalog files', () => {
  it('prints config.json with inline labels', () => {
    const config: CatalogConfig = {
      tags: [
        { id: 'bombs', name: 'Bombs', icon: 'bomb' },
        { id: 'fences', name: 'Fences', icon: 'fence' }
      ],
      categories: []
    };

    expect(createConfigFile(config)).toBe(`{
  "tags": [
    { "id": "bombs", "name": "Bombs", "icon": "bomb" },
    { "id": "fences", "name": "Fences", "icon": "fence" }
  ],
  "categories": []
}
`);
  });

  it('prints items.json with expanded objects and long strings kept on their key line', () => {
    const description =
      'Place it in the water, load it with bait, and check the next day to see if you\'ve caught "anything". Works anywhere.';
    const items: Item[] = [
      {
        id: 'crab_pot',
        name: 'Crab Pot',
        description,
        imageUrl: './images/crab_pot.png',
        links: [{ text: 'Wiki Link', url: 'https://stardewvalleywiki.com/Crab_Pot' }],
        categories: ['crafting'],
        tags: [],
        ingredients: [{ id: 'wood', quantity: 40 }]
      }
    ];

    expect(createItemsFile(items)).toBe(`[
  {
    "id": "crab_pot",
    "name": "Crab Pot",
    "description": ${JSON.stringify(description)},
    "imageUrl": "./images/crab_pot.png",
    "links": [
      {
        "text": "Wiki Link",
        "url": "https://stardewvalleywiki.com/Crab_Pot"
      }
    ],
    "categories": ["crafting"],
    "tags": [],
    "ingredients": [
      {
        "id": "wood",
        "quantity": 40
      }
    ]
  }
]
`);
    expect(JSON.parse(createItemsFile(items))).toEqual(items);
  });

  it('prints bundles.json without undefined fields', () => {
    const bundles: Bundle[] = [{ id: 'notes', name: 'Notes', required: undefined, items: [{ itemId: 'bomb' }] }];

    expect(createBundlesFile(bundles)).toBe(`[
  {
    "id": "notes",
    "name": "Notes",
    "items": [{ "itemId": "bomb" }]
  }
]
`);
    expect(createBundlesFile([])).toBe('[]\n');
  });
});
