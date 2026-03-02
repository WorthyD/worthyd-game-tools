import { ScraperConfig } from '@crafting-cart/shared/models';
export const config: ScraperConfig = {
  baseUrl: 'https://stardewvalleywiki.com/',
  assetPath: './images/',
  imagePath: './scrapers/images/',
  configOutputPath: './scrapers/stardew-output.ts',
  tags: [
    'Bombs',
    'Fences',
    'Sprinklers',
    'Artisan_Equipment',
    'Fertilizer',
    'Ores',
    'Combat_Resources',
    'Seeds',
    'Decor',
    'Fishing',
    'Rings',
    'Edible_Items',
    'Consumables',
    'Lighting',
    'Refining_Equipment',
    'Furniture',
    'Storage_Equipment',
    'Signs',
    'Misc'
  ],
  categories: ['Crafting', 'Raw_Materials', 'Cooking'],
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
    },
    {
      itemUrl: 'Wood_Floor',
      itemId: 'wood_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Rustic_Plank_Floor',
      itemId: 'rustic_plank_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Straw_Floor',
      itemId: 'straw_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Weathered_Floor',
      itemId: 'weathered_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Crystal_Floor',
      itemId: 'crystal_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Stone_Floor',
      itemId: 'stone_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Stone_Walkway_Floor',
      itemId: 'stone_walkway_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Brick_Floor',
      itemId: 'brick_floor',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Wood_Path',
      itemId: 'wood_path',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Gravel_Path',
      itemId: 'gravel_path',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Cobblestone_Path',
      itemId: 'cobblestone_path',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Stepping_Stone_Path',
      itemId: 'stepping_stone_path',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Crystal_Path',
      itemId: 'crystal_path',
      categories: ['Crafting'],
      tags: ['Decor']
    },
    {
      itemUrl: 'Spinner',
      itemId: 'spinner',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Trap_Bobber',
      itemId: 'trap_bobber',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Cork_Bobber',
      itemId: 'cork_bobber',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Quality_Bobber',
      itemId: 'quality_bobber',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Treasure_Hunter',
      itemId: 'treasure_hunter',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Dressed_Spinner',
      itemId: 'dressed_spinner',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Barbed_Hook',
      itemId: 'barbed_hook',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Magnet',
      itemId: 'magnet',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Bait_(item)',
      itemId: 'bait_(item)',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Deluxe_Bait',
      itemId: 'deluxe_bait',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Wild_Bait',
      itemId: 'wild_bait',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Magic_Bait',
      itemId: 'magic_bait',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Challenge_Bait',
      itemId: 'challenge_bait',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Crab_Pot',
      itemId: 'crab_pot',
      categories: ['Crafting'],
      tags: ['Fishing']
    },
    {
      itemUrl: 'Sturdy_Ring',
      itemId: 'sturdy_ring',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Warrior_Ring',
      itemId: 'warrior_ring',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Ring_of_Yoba',
      itemId: 'ring_of_yoba',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Thorns_Ring',
      itemId: 'thorns_ring',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Glowstone_Ring',
      itemId: 'glowstone_ring',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Iridium_Band',
      itemId: 'iridium_band',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Wedding_Ring',
      itemId: 'wedding_ring',
      categories: ['Crafting'],
      tags: ['Rings']
    },
    {
      itemUrl: 'Field_Snack',
      itemId: 'field_snack',
      categories: ['Crafting'],
      tags: ['Edible_Items']
    },
    {
      itemUrl: 'Bug_Steak',
      itemId: 'bug_steak',
      categories: ['Crafting'],
      tags: ['Edible_Items']
    },
    {
      itemUrl: 'Life_Elixir',
      itemId: 'life_elixir',
      categories: ['Crafting'],
      tags: ['Edible_Items']
    },
    {
      itemUrl: 'Oil_of_Garlic',
      itemId: 'oil_of_garlic',
      categories: ['Crafting'],
      tags: ['Edible_Items']
    },
    {
      itemUrl: 'Monster_Musk',
      itemId: 'monster_musk',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Fairy_Dust',
      itemId: 'fairy_dust',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Beach',
      itemId: 'warp_totem:_beach',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Mountains',
      itemId: 'warp_totem:_mountains',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Farm',
      itemId: 'warp_totem:_farm',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Desert',
      itemId: 'warp_totem:_desert',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Island',
      itemId: 'warp_totem:_island',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Rain_Totem',
      itemId: 'rain_totem',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Treasure_Totem',
      itemId: 'treasure_totem',
      categories: ['Crafting'],
      tags: ['Consumables']
    },
    {
      itemUrl: 'Torch',
      itemId: 'torch',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Campfire',
      itemId: 'campfire',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Wooden_Brazier',
      itemId: 'wooden_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Stone_Brazier',
      itemId: 'stone_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Gold_Brazier',
      itemId: 'gold_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Carved_Brazier',
      itemId: 'carved_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Carved_Brazier',
      itemId: 'carved_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Barrel_Brazier',
      itemId: 'barrel_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Skull_Brazier',
      itemId: 'skull_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Marble_Brazier',
      itemId: 'marble_brazier',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Wood_Lamp-post',
      itemId: 'wood_lamp-post',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Iron_Lamp-post',
      itemId: 'iron_lamp-post',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Jack-O-Lantern',
      itemId: 'jack-o-lantern',
      categories: ['Crafting'],
      tags: ['Lighting']
    },
    {
      itemUrl: 'Charcoal_Kiln',
      itemId: 'charcoal_kiln',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Crystalarium',
      itemId: 'crystalarium',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Furnace',
      itemId: 'furnace',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Heavy_Furnace',
      itemId: 'heavy_furnace',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Lightning_Rod',
      itemId: 'lightning_rod',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Solar_Panel',
      itemId: 'solar_panel',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Recycling_Machine',
      itemId: 'recycling_machine',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Seed_Maker',
      itemId: 'seed_maker',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Slime_Incubator',
      itemId: 'slime_incubator',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Ostrich_Incubator',
      itemId: 'ostrich_incubator',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Slime_Egg-Press',
      itemId: 'slime_egg-press',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Tapper',
      itemId: 'tapper',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Heavy_Tapper',
      itemId: 'heavy_tapper',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Worm_Bin',
      itemId: 'worm_bin',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Deluxe_Worm_Bin',
      itemId: 'deluxe_worm_bin',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Bone_Mill',
      itemId: 'bone_mill',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Geode_Crusher',
      itemId: 'geode_crusher',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Mushroom_Log',
      itemId: 'mushroom_log',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Bait_Maker',
      itemId: 'bait_maker',
      categories: ['Crafting'],
      tags: ['Refining_Equipment']
    },
    {
      itemUrl: 'Tub_o%27_Flowers',
      itemId: 'tub_o%27_flowers',
      categories: ['Crafting'],
      tags: ['Furniture']
    },
    {
      itemUrl: 'Wicked_Statue',
      itemId: 'wicked_statue',
      categories: ['Crafting'],
      tags: ['Furniture']
    },
    {
      itemUrl: 'Flute_Block',
      itemId: 'flute_block',
      categories: ['Crafting'],
      tags: ['Furniture']
    },
    {
      itemUrl: 'Drum_Block',
      itemId: 'drum_block',
      categories: ['Crafting'],
      tags: ['Furniture']
    },
    {
      itemUrl: 'Chest',
      itemId: 'chest',
      categories: ['Crafting'],
      tags: ['Storage_Equipment']
    },
    {
      itemUrl: 'Stone_Chest',
      itemId: 'stone_chest',
      categories: ['Crafting'],
      tags: ['Storage_Equipment']
    },
    {
      itemUrl: 'Big_Chest',
      itemId: 'big_chest',
      categories: ['Crafting'],
      tags: ['Storage_Equipment']
    },
    {
      itemUrl: 'Big_Stone_Chest',
      itemId: 'big_stone_chest',
      categories: ['Crafting'],
      tags: ['Storage_Equipment']
    },
    {
      itemUrl: 'Wood_Sign',
      itemId: 'wood_sign',
      categories: ['Crafting'],
      tags: ['Signs']
    },
    {
      itemUrl: 'Stone_Sign',
      itemId: 'stone_sign',
      categories: ['Crafting'],
      tags: ['Signs']
    },
    {
      itemUrl: 'Dark_Sign',
      itemId: 'dark_sign',
      categories: ['Crafting'],
      tags: ['Signs']
    },
    {
      itemUrl: 'Text_Sign',
      itemId: 'text_sign',
      categories: ['Crafting'],
      tags: ['Signs']
    },
    {
      itemUrl: 'Garden_Pot',
      itemId: 'garden_pot',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Scarecrow',
      itemId: 'scarecrow',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Deluxe_Scarecrow',
      itemId: 'deluxe_scarecrow',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Staircase',
      itemId: 'staircase',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Explosive_Ammo',
      itemId: 'explosive_ammo',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Mini-Jukebox',
      itemId: 'mini-jukebox',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Mini-Obelisk',
      itemId: 'mini-obelisk',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Farm_Computer',
      itemId: 'farm_computer',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Hopper',
      itemId: 'hopper',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Cookout_Kit',
      itemId: 'cookout_kit',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Tent_Kit',
      itemId: 'tent_kit',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Statue_Of_The_Dwarf_King',
      itemId: 'statue_of_the_dwarf_king',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Statue_Of_Blessings',
      itemId: 'statue_of_blessings',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Anvil',
      itemId: 'anvil',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Mini-Forge',
      itemId: 'mini-forge',
      categories: ['Crafting'],
      tags: ['Misc']
    },
    {
      itemUrl: 'Coal',
      itemId: 'coal',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Wood',
      itemId: 'wood',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Stone',
      itemId: 'stone',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Iron_Bar',
      itemId: 'iron_bar',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Hardwood',
      itemId: 'hardwood',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Copper_Bar',
      itemId: 'copper_bar',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Gold_Bar',
      itemId: 'gold_bar',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Iridium_Bar',
      itemId: 'iridium_bar',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Battery_Pack',
      itemId: 'battery_pack',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Earth_Crystal',
      itemId: 'earth_crystal',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Maple_Syrup',
      itemId: 'maple_syrup',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Fiber',
      itemId: 'fiber',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Pine_Tar',
      itemId: 'pine_tar',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Oak_Resin',
      itemId: 'oak_resin',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Slime',
      itemId: 'slime',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Sea_Jelly',
      itemId: 'sea_jelly',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'River_Jelly',
      itemId: 'river_jelly',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Cave_Jelly',
      itemId: 'cave_jelly',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Fire_Quartz',
      itemId: 'fire_quartz',
      categories: ['Raw_Materials'],
      tags: []
    },
    {
      itemUrl: 'Sap',
      itemId: 'sap',
      categories: ['Raw_Materials'],
      tags: []
    }
  ]
};
