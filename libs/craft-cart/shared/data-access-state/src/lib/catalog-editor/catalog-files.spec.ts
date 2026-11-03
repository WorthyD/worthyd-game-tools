import { Item, ScraperConfig } from '@crafting-cart/shared/models';
import { createConfigFile, createItemsFile, quoteString } from './catalog-files';

describe('catalog files', () => {
  it('quotes strings like Prettier with singleQuote', () => {
    expect(quoteString('Bomb')).toBe("'Bomb'");
    expect(quoteString("Doesn't work")).toBe('"Doesn\'t work"');
    expect(quoteString('A "perfect" catch')).toBe('\'A "perfect" catch\'');
    expect(quoteString(`It's a "fish"`)).toBe("'It\\'s a \"fish\"'");
  });

  it('prints config.ts with inline labels and expanded item configs', () => {
    const config: ScraperConfig = {
      baseUrl: 'https://stardewvalleywiki.com/',
      assetPath: './images/',
      imagePath: './scrapers/images/',
      configOutputPath: './scrapers/stardew-output.ts',
      tags: [
        { id: 'bombs', name: 'Bombs', icon: 'bomb' },
        { id: 'fences', name: 'Fences', icon: 'fence' }
      ],
      categories: [],
      items: [{ itemUrl: 'Bomb', itemId: 'bomb', categories: ['crafting'], tags: ['bombs'] }]
    };

    expect(createConfigFile(config)).toBe(`import { ScraperConfig } from '@crafting-cart/shared/models';
export const config: ScraperConfig = {
  baseUrl: 'https://stardewvalleywiki.com/',
  assetPath: './images/',
  imagePath: './scrapers/images/',
  configOutputPath: './scrapers/stardew-output.ts',
  tags: [
    { id: 'bombs', name: 'Bombs', icon: 'bomb' },
    { id: 'fences', name: 'Fences', icon: 'fence' }
  ],
  categories: [],
  items: [
    {
      itemUrl: 'Bomb',
      itemId: 'bomb',
      categories: ['crafting'],
      tags: ['bombs']
    }
  ]
};
`);
  });

  it('prints items.ts with expanded objects and long strings on their own line', () => {
    const description =
      "Place it in the water, load it with bait, and check the next day to see if you've caught anything. Works anywhere.";
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

    expect(createItemsFile(items)).toBe(`export const items = [
  {
    id: 'crab_pot',
    name: 'Crab Pot',
    description:
      "${description}",
    imageUrl: './images/crab_pot.png',
    links: [
      {
        text: 'Wiki Link',
        url: 'https://stardewvalleywiki.com/Crab_Pot'
      }
    ],
    categories: ['crafting'],
    tags: [],
    ingredients: [
      {
        id: 'wood',
        quantity: 40
      }
    ]
  }
];
`);
  });
});
