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

    // ----------------------Fences----------------------
    {
      itemId: 'gate',
      itemUrl: 'Gate',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemId: 'wood_fence',
      itemUrl: 'Wood_Fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemId: 'stone_fence',
      itemUrl: 'Stone_Fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemId: 'iron_fence',
      itemUrl: 'Iron_Fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemId: 'hardwood_fence',
      itemUrl: 'Hardwood_Fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    // ----------------------Sprinklers----------------------
   {
      itemId: 'sprinkler',
      itemUrl: 'Sprinkler',
      categories: ['Crafting'],
      tags: ['Sprinklers']
    },
    {
      itemId: 'quality_sprinkler',
      itemUrl: 'Quality_Sprinkler',
      categories: ['Crafting'],
      tags: ['Sprinklers']
    },
    {
      itemId: 'iridium_sprinkler',
      itemUrl: 'Iridium_Sprinkler',
      categories: ['Crafting'],
      tags: ['Sprinklers']
    },
    // ----------------------Artisan Equipment----------------------
{
      itemId: 'mayonnaise_machine',
      itemUrl: 'Mayonnaise_Machine',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemId: 'bee_house',
      itemUrl: 'Bee_House',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
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
