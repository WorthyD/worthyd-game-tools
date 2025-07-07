import { ScraperConfig } from "./config.model";
export const config : ScraperConfig= {
  baseUrl: 'https://stardewvalleywiki.com/',
  assetPath: './images/',
  imagePath: './scrapers/images/',
  configOutputPath: './scrapers/stardew-output.ts',
  items: [
    {
      itemId: 'cherry_bomb',
      itemUrl: 'Cherry_Bomb',
      categories: ['Crafting'],
      tags: ['Bombs']
    },
    {
      itemId: 'bomb',
      itemUrl: 'Bomb',
      categories: ['Crafting'],
      tags: ['Bombs']
    },
    {
      itemId: 'mega_bomb',
      itemUrl: 'Mega_Bomb',
      categories: ['Crafting'],
      tags: ['Bombs']
    },
    {
      itemId: 'copper_ore',
      itemUrl: 'Copper_Ore',
      categories: ['Raw_Materials'],
      tags: ['Ores']
    },
    {
      itemId: 'iron_ore',
      itemUrl: 'Iron_Ore',
      categories: ['Raw_Materials'],
      tags: ['Ores']
    },
    {
      itemId: 'gold_ore',
      itemUrl: 'Gold_Ore',
      categories: ['Raw_Materials'],
      tags: ['Ores']
    },
    {
      itemId: 'solar_essence',
      itemUrl: 'Solar_Essence',
      categories: ['Raw_Materials'],
      tags: ['Combat_Resources']
    },
    {
      itemId: 'void_essence',
      itemUrl: 'Void_Essence',
      categories: ['Raw_Materials'],
      tags: ['Combat_Resources']
    }
  ]
};
