import { ScraperConfig } from '@crafting-cart/shared/models';
export const config: ScraperConfig = {
  baseUrl: 'https://stardewvalleywiki.com/',
  assetPath: './images/',
  imagePath: './scrapers/images/',
  configOutputPath: './scrapers/stardew-output.ts',
  tags: ['Bombs', 'Fences', 'Sprinklers', 'Artisan_Equipment', 'Fertilizer', 'Ores', 'Combat_Resources', 'Seeds'],
  categories: ['Crafting', 'Raw_Materials'],
  items: [
    {
      itemUrl: 'Cherry_Bomb',
      itemId: 'cherry_bomb',
      categories: ['Crafting'],
      tags: ['Bombs']
    },
    {
      itemUrl: 'Bomb',
      itemId: 'bomb',
      categories: ['Crafting'],
      tags: ['Bombs']
    },
    {
      itemUrl: 'Mega_Bomb',
      itemId: 'mega_bomb',
      categories: ['Crafting'],
      tags: ['Bombs']
    },
    {
      itemUrl: 'Gate',
      itemId: 'gate',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemUrl: 'Wood_Fence',
      itemId: 'wood_fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemUrl: 'Stone_Fence',
      itemId: 'stone_fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemUrl: 'Iron_Fence',
      itemId: 'iron_fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemUrl: 'Hardwood_Fence',
      itemId: 'hardwood_fence',
      categories: ['Crafting'],
      tags: ['Fences']
    },
    {
      itemUrl: 'Sprinkler',
      itemId: 'sprinkler',
      categories: ['Crafting'],
      tags: ['Sprinklers']
    },
    {
      itemUrl: 'Quality_Sprinkler',
      itemId: 'quality_sprinkler',
      categories: ['Crafting'],
      tags: ['Sprinklers']
    },
    {
      itemUrl: 'Iridium_Sprinkler',
      itemId: 'iridium_sprinkler',
      categories: ['Crafting'],
      tags: ['Sprinklers']
    },
    {
      itemUrl: 'Mayonnaise_Machine',
      itemId: 'mayonnaise_machine',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Bee_House',
      itemId: 'bee_house',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Preserves_Jar',
      itemId: 'preserves_jar',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Cheese_Press',
      itemId: 'cheese_press',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Loom',
      itemId: 'loom',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Keg',
      itemId: 'keg',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Oil_Maker',
      itemId: 'oil_maker',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Cask',
      itemId: 'cask',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Fish_Smoker',
      itemId: 'fish_smoker',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Dehydrator',
      itemId: 'dehydrator',
      categories: ['Crafting'],
      tags: ['Artisan_Equipment']
    },
    {
      itemUrl: 'Basic_Fertilizer',
      itemId: 'basic_fertilizer',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Quality_Fertilizer',
      itemId: 'quality_fertilizer',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Deluxe_Fertilizer',
      itemId: 'deluxe_fertilizer',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Speed-Gro',
      itemId: 'speed-gro',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Deluxe_Speed-Gro',
      itemId: 'deluxe_speed-gro',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Hyper_Speed-Gro',
      itemId: 'hyper_speed-gro',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Basic_Retaining_Soil',
      itemId: 'basic_retaining_soil',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Quality_Retaining_Soil',
      itemId: 'quality_retaining_soil',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Deluxe_Retaining_Soil',
      itemId: 'deluxe_retaining_soil',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Tree_Fertilizer',
      itemId: 'tree_fertilizer',
      categories: ['Crafting'],
      tags: ['Fertilizer']
    },
    {
      itemUrl: 'Copper_Ore',
      itemId: 'copper_ore',
      categories: ['Raw_Materials'],
      tags: ['Ores']
    },
    {
      itemUrl: 'Iron_Ore',
      itemId: 'iron_ore',
      categories: ['Raw_Materials'],
      tags: ['Ores']
    },
    {
      itemUrl: 'Gold_Ore',
      itemId: 'gold_ore',
      categories: ['Raw_Materials'],
      tags: ['Ores']
    },
    {
      itemUrl: 'Solar_Essence',
      itemId: 'solar_essence',
      categories: ['Raw_Materials'],
      tags: ['Combat_Resources']
    },
    {
      itemUrl: 'Void_Essence',
      itemId: 'void_essence',
      categories: ['Raw_Materials'],
      tags: ['Combat_Resources']
    },
    {
      itemUrl: 'Spring_Seeds',
      itemId: 'spring_seeds',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Summer_Seeds',
      itemId: 'summer_seeds',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Fall_Seeds',
      itemId: 'fall_seeds',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Winter_Seeds',
      itemId: 'winter_seeds',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Ancient_Seeds',
      itemId: 'ancient_seeds',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Grass_Starter',
      itemId: 'grass_starter',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Blue_Grass_Starter',
      itemId: 'blue_grass_starter',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Tea_Sapling',
      itemId: 'tea_sapling',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Fiber_Seeds',
      itemId: 'fiber_seeds',
      categories: ['Crafting'],
      tags: ['Seeds']
    },
    {
      itemUrl: 'Mystic_Tree_Seed',
      itemId: 'mystic_tree_seed',
      categories: ['Crafting'],
      tags: ['Seeds']
    }
  ]
};
