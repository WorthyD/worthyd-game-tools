import { ScraperConfig } from '@crafting-cart/shared/models';
export const config: ScraperConfig = {
  baseUrl: 'https://stardewvalleywiki.com/',
  assetPath: './images/',
  imagePath: './scrapers/images/',
  configOutputPath: './scrapers/stardew-output.ts',
  tags: [
    { id: 'bombs', name: 'Bombs', icon: 'bomb' },
    { id: 'fences', name: 'Fences', icon: 'fence' },
    { id: 'sprinklers', name: 'Sprinklers', icon: 'sprinkler' },
    { id: 'artisan_equipment', name: 'Artisan Equipment', icon: 'wine_bar' },
    { id: 'fertilizer', name: 'Fertilizer', icon: 'compost' },
    { id: 'ores', name: 'Ores', icon: 'landslide' },
    { id: 'combat_resources', name: 'Combat Resources', icon: 'swords' },
    { id: 'seeds', name: 'Seeds', icon: 'psychiatry' },
    { id: 'decor', name: 'Decor', icon: 'potted_plant' },
    { id: 'fishing', name: 'Fishing', icon: 'phishing' },
    { id: 'rings', name: 'Rings', icon: 'diamond' },
    { id: 'edible_items', name: 'Edible Items', icon: 'nutrition' },
    { id: 'consumables', name: 'Consumables', icon: 'auto_awesome' },
    { id: 'lighting', name: 'Lighting', icon: 'lightbulb' },
    { id: 'refining_equipment', name: 'Refining Equipment', icon: 'factory' },
    { id: 'furniture', name: 'Furniture', icon: 'chair' },
    { id: 'storage_equipment', name: 'Storage Equipment', icon: 'inventory_2' },
    { id: 'signs', name: 'Signs', icon: 'signpost' },
    { id: 'misc', name: 'Misc', icon: 'more_horiz' }
  ],
  categories: [
    { id: 'crafting', name: 'Crafting', icon: 'handyman' },
    { id: 'raw_materials', name: 'Raw Materials', icon: 'forest' },
    { id: 'cooking', name: 'Cooking', icon: 'skillet' }
  ],
  items: [
    {
      itemUrl: 'Cherry_Bomb',
      itemId: 'cherry_bomb',
      categories: ['crafting'],
      tags: ['bombs']
    },
    {
      itemUrl: 'Bomb',
      itemId: 'bomb',
      categories: ['crafting'],
      tags: ['bombs']
    },
    {
      itemUrl: 'Mega_Bomb',
      itemId: 'mega_bomb',
      categories: ['crafting'],
      tags: ['bombs']
    },
    {
      itemUrl: 'Gate',
      itemId: 'gate',
      categories: ['crafting'],
      tags: ['fences']
    },
    {
      itemUrl: 'Wood_Fence',
      itemId: 'wood_fence',
      categories: ['crafting'],
      tags: ['fences']
    },
    {
      itemUrl: 'Stone_Fence',
      itemId: 'stone_fence',
      categories: ['crafting'],
      tags: ['fences']
    },
    {
      itemUrl: 'Iron_Fence',
      itemId: 'iron_fence',
      categories: ['crafting'],
      tags: ['fences']
    },
    {
      itemUrl: 'Hardwood_Fence',
      itemId: 'hardwood_fence',
      categories: ['crafting'],
      tags: ['fences']
    },
    {
      itemUrl: 'Sprinkler',
      itemId: 'sprinkler',
      categories: ['crafting'],
      tags: ['sprinklers']
    },
    {
      itemUrl: 'Quality_Sprinkler',
      itemId: 'quality_sprinkler',
      categories: ['crafting'],
      tags: ['sprinklers']
    },
    {
      itemUrl: 'Iridium_Sprinkler',
      itemId: 'iridium_sprinkler',
      categories: ['crafting'],
      tags: ['sprinklers']
    },
    {
      itemUrl: 'Mayonnaise_Machine',
      itemId: 'mayonnaise_machine',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Bee_House',
      itemId: 'bee_house',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Preserves_Jar',
      itemId: 'preserves_jar',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Cheese_Press',
      itemId: 'cheese_press',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Loom',
      itemId: 'loom',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Keg',
      itemId: 'keg',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Oil_Maker',
      itemId: 'oil_maker',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Cask',
      itemId: 'cask',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Fish_Smoker',
      itemId: 'fish_smoker',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Dehydrator',
      itemId: 'dehydrator',
      categories: ['crafting'],
      tags: ['artisan_equipment']
    },
    {
      itemUrl: 'Basic_Fertilizer',
      itemId: 'basic_fertilizer',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Quality_Fertilizer',
      itemId: 'quality_fertilizer',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Deluxe_Fertilizer',
      itemId: 'deluxe_fertilizer',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Speed-Gro',
      itemId: 'speed-gro',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Deluxe_Speed-Gro',
      itemId: 'deluxe_speed-gro',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Hyper_Speed-Gro',
      itemId: 'hyper_speed-gro',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Basic_Retaining_Soil',
      itemId: 'basic_retaining_soil',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Quality_Retaining_Soil',
      itemId: 'quality_retaining_soil',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Deluxe_Retaining_Soil',
      itemId: 'deluxe_retaining_soil',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Tree_Fertilizer',
      itemId: 'tree_fertilizer',
      categories: ['crafting'],
      tags: ['fertilizer']
    },
    {
      itemUrl: 'Copper_Ore',
      itemId: 'copper_ore',
      categories: ['raw_materials'],
      tags: ['ores']
    },
    {
      itemUrl: 'Iron_Ore',
      itemId: 'iron_ore',
      categories: ['raw_materials'],
      tags: ['ores']
    },
    {
      itemUrl: 'Gold_Ore',
      itemId: 'gold_ore',
      categories: ['raw_materials'],
      tags: ['ores']
    },
    {
      itemUrl: 'Solar_Essence',
      itemId: 'solar_essence',
      categories: ['raw_materials'],
      tags: ['combat_resources']
    },
    {
      itemUrl: 'Void_Essence',
      itemId: 'void_essence',
      categories: ['raw_materials'],
      tags: ['combat_resources']
    },
    {
      itemUrl: 'Spring_Seeds',
      itemId: 'spring_seeds',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Summer_Seeds',
      itemId: 'summer_seeds',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Fall_Seeds',
      itemId: 'fall_seeds',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Winter_Seeds',
      itemId: 'winter_seeds',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Ancient_Seeds',
      itemId: 'ancient_seeds',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Grass_Starter',
      itemId: 'grass_starter',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Blue_Grass_Starter',
      itemId: 'blue_grass_starter',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Tea_Sapling',
      itemId: 'tea_sapling',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Fiber_Seeds',
      itemId: 'fiber_seeds',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Mystic_Tree_Seed',
      itemId: 'mystic_tree_seed',
      categories: ['crafting'],
      tags: ['seeds']
    },
    {
      itemUrl: 'Wood_Floor',
      itemId: 'wood_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Rustic_Plank_Floor',
      itemId: 'rustic_plank_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Straw_Floor',
      itemId: 'straw_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Weathered_Floor',
      itemId: 'weathered_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Crystal_Floor',
      itemId: 'crystal_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Stone_Floor',
      itemId: 'stone_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Stone_Walkway_Floor',
      itemId: 'stone_walkway_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Brick_Floor',
      itemId: 'brick_floor',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Wood_Path',
      itemId: 'wood_path',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Gravel_Path',
      itemId: 'gravel_path',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Cobblestone_Path',
      itemId: 'cobblestone_path',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Stepping_Stone_Path',
      itemId: 'stepping_stone_path',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Crystal_Path',
      itemId: 'crystal_path',
      categories: ['crafting'],
      tags: ['decor']
    },
    {
      itemUrl: 'Spinner',
      itemId: 'spinner',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Trap_Bobber',
      itemId: 'trap_bobber',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Cork_Bobber',
      itemId: 'cork_bobber',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Quality_Bobber',
      itemId: 'quality_bobber',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Treasure_Hunter',
      itemId: 'treasure_hunter',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Dressed_Spinner',
      itemId: 'dressed_spinner',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Barbed_Hook',
      itemId: 'barbed_hook',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Magnet',
      itemId: 'magnet',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Bait_(item)',
      itemId: 'bait_(item)',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Deluxe_Bait',
      itemId: 'deluxe_bait',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Wild_Bait',
      itemId: 'wild_bait',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Magic_Bait',
      itemId: 'magic_bait',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Challenge_Bait',
      itemId: 'challenge_bait',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Crab_Pot',
      itemId: 'crab_pot',
      categories: ['crafting'],
      tags: ['fishing']
    },
    {
      itemUrl: 'Sturdy_Ring',
      itemId: 'sturdy_ring',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Warrior_Ring',
      itemId: 'warrior_ring',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Ring_of_Yoba',
      itemId: 'ring_of_yoba',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Thorns_Ring',
      itemId: 'thorns_ring',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Glowstone_Ring',
      itemId: 'glowstone_ring',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Iridium_Band',
      itemId: 'iridium_band',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Wedding_Ring',
      itemId: 'wedding_ring',
      categories: ['crafting'],
      tags: ['rings']
    },
    {
      itemUrl: 'Field_Snack',
      itemId: 'field_snack',
      categories: ['crafting'],
      tags: ['edible_items']
    },
    {
      itemUrl: 'Bug_Steak',
      itemId: 'bug_steak',
      categories: ['crafting'],
      tags: ['edible_items']
    },
    {
      itemUrl: 'Life_Elixir',
      itemId: 'life_elixir',
      categories: ['crafting'],
      tags: ['edible_items']
    },
    {
      itemUrl: 'Oil_of_Garlic',
      itemId: 'oil_of_garlic',
      categories: ['crafting'],
      tags: ['edible_items']
    },
    {
      itemUrl: 'Monster_Musk',
      itemId: 'monster_musk',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Fairy_Dust',
      itemId: 'fairy_dust',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Beach',
      itemId: 'warp_totem:_beach',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Mountains',
      itemId: 'warp_totem:_mountains',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Farm',
      itemId: 'warp_totem:_farm',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Desert',
      itemId: 'warp_totem:_desert',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Warp_Totem:_Island',
      itemId: 'warp_totem:_island',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Rain_Totem',
      itemId: 'rain_totem',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Treasure_Totem',
      itemId: 'treasure_totem',
      categories: ['crafting'],
      tags: ['consumables']
    },
    {
      itemUrl: 'Torch',
      itemId: 'torch',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Campfire',
      itemId: 'campfire',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Wooden_Brazier',
      itemId: 'wooden_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Stone_Brazier',
      itemId: 'stone_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Gold_Brazier',
      itemId: 'gold_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Carved_Brazier',
      itemId: 'carved_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Carved_Brazier',
      itemId: 'carved_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Barrel_Brazier',
      itemId: 'barrel_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Skull_Brazier',
      itemId: 'skull_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Marble_Brazier',
      itemId: 'marble_brazier',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Wood_Lamp-post',
      itemId: 'wood_lamp-post',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Iron_Lamp-post',
      itemId: 'iron_lamp-post',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Jack-O-Lantern',
      itemId: 'jack-o-lantern',
      categories: ['crafting'],
      tags: ['lighting']
    },
    {
      itemUrl: 'Charcoal_Kiln',
      itemId: 'charcoal_kiln',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Crystalarium',
      itemId: 'crystalarium',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Furnace',
      itemId: 'furnace',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Heavy_Furnace',
      itemId: 'heavy_furnace',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Lightning_Rod',
      itemId: 'lightning_rod',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Solar_Panel',
      itemId: 'solar_panel',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Recycling_Machine',
      itemId: 'recycling_machine',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Seed_Maker',
      itemId: 'seed_maker',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Slime_Incubator',
      itemId: 'slime_incubator',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Ostrich_Incubator',
      itemId: 'ostrich_incubator',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Slime_Egg-Press',
      itemId: 'slime_egg-press',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Tapper',
      itemId: 'tapper',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Heavy_Tapper',
      itemId: 'heavy_tapper',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Worm_Bin',
      itemId: 'worm_bin',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Deluxe_Worm_Bin',
      itemId: 'deluxe_worm_bin',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Bone_Mill',
      itemId: 'bone_mill',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Geode_Crusher',
      itemId: 'geode_crusher',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Mushroom_Log',
      itemId: 'mushroom_log',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Bait_Maker',
      itemId: 'bait_maker',
      categories: ['crafting'],
      tags: ['refining_equipment']
    },
    {
      itemUrl: 'Tub_o%27_Flowers',
      itemId: 'tub_o%27_flowers',
      categories: ['crafting'],
      tags: ['furniture']
    },
    {
      itemUrl: 'Wicked_Statue',
      itemId: 'wicked_statue',
      categories: ['crafting'],
      tags: ['furniture']
    },
    {
      itemUrl: 'Flute_Block',
      itemId: 'flute_block',
      categories: ['crafting'],
      tags: ['furniture']
    },
    {
      itemUrl: 'Drum_Block',
      itemId: 'drum_block',
      categories: ['crafting'],
      tags: ['furniture']
    },
    {
      itemUrl: 'Chest',
      itemId: 'chest',
      categories: ['crafting'],
      tags: ['storage_equipment']
    },
    {
      itemUrl: 'Stone_Chest',
      itemId: 'stone_chest',
      categories: ['crafting'],
      tags: ['storage_equipment']
    },
    {
      itemUrl: 'Big_Chest',
      itemId: 'big_chest',
      categories: ['crafting'],
      tags: ['storage_equipment']
    },
    {
      itemUrl: 'Big_Stone_Chest',
      itemId: 'big_stone_chest',
      categories: ['crafting'],
      tags: ['storage_equipment']
    },
    {
      itemUrl: 'Wood_Sign',
      itemId: 'wood_sign',
      categories: ['crafting'],
      tags: ['signs']
    },
    {
      itemUrl: 'Stone_Sign',
      itemId: 'stone_sign',
      categories: ['crafting'],
      tags: ['signs']
    },
    {
      itemUrl: 'Dark_Sign',
      itemId: 'dark_sign',
      categories: ['crafting'],
      tags: ['signs']
    },
    {
      itemUrl: 'Text_Sign',
      itemId: 'text_sign',
      categories: ['crafting'],
      tags: ['signs']
    },
    {
      itemUrl: 'Garden_Pot',
      itemId: 'garden_pot',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Scarecrow',
      itemId: 'scarecrow',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Deluxe_Scarecrow',
      itemId: 'deluxe_scarecrow',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Staircase',
      itemId: 'staircase',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Explosive_Ammo',
      itemId: 'explosive_ammo',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Mini-Jukebox',
      itemId: 'mini-jukebox',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Mini-Obelisk',
      itemId: 'mini-obelisk',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Farm_Computer',
      itemId: 'farm_computer',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Hopper',
      itemId: 'hopper',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Cookout_Kit',
      itemId: 'cookout_kit',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Tent_Kit',
      itemId: 'tent_kit',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Statue_Of_The_Dwarf_King',
      itemId: 'statue_of_the_dwarf_king',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Statue_Of_Blessings',
      itemId: 'statue_of_blessings',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Anvil',
      itemId: 'anvil',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Mini-Forge',
      itemId: 'mini-forge',
      categories: ['crafting'],
      tags: ['misc']
    },
    {
      itemUrl: 'Coal',
      itemId: 'coal',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Wood',
      itemId: 'wood',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Stone',
      itemId: 'stone',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Iron_Bar',
      itemId: 'iron_bar',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Hardwood',
      itemId: 'hardwood',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Copper_Bar',
      itemId: 'copper_bar',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Gold_Bar',
      itemId: 'gold_bar',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Iridium_Bar',
      itemId: 'iridium_bar',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Battery_Pack',
      itemId: 'battery_pack',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Earth_Crystal',
      itemId: 'earth_crystal',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Maple_Syrup',
      itemId: 'maple_syrup',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Fiber',
      itemId: 'fiber',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Pine_Tar',
      itemId: 'pine_tar',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Oak_Resin',
      itemId: 'oak_resin',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Slime',
      itemId: 'slime',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Sea_Jelly',
      itemId: 'sea_jelly',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'River_Jelly',
      itemId: 'river_jelly',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Cave_Jelly',
      itemId: 'cave_jelly',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Fire_Quartz',
      itemId: 'fire_quartz',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Sap',
      itemId: 'sap',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Clay',
      itemId: 'clay',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Bone_Fragment',
      itemId: 'bone_fragment',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Radioactive_Ore',
      itemId: 'radioactive_ore',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Wild_Horseradish',
      itemId: 'wild_horseradish',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Daffodil',
      itemId: 'daffodil',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Leek',
      itemId: 'leek',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Dandelion',
      itemId: 'dandelion',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Spice_Berry',
      itemId: 'spice_berry',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Grape',
      itemId: 'grape',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Sweet_Pea',
      itemId: 'sweet_pea',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Common_Mushroom',
      itemId: 'common_mushroom',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Wild_Plum',
      itemId: 'wild_plum',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Hazelnut',
      itemId: 'hazelnut',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Blackberry',
      itemId: 'blackberry',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Winter_Root',
      itemId: 'winter_root',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Refined_Quartz',
      itemId: 'refined_quartz',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Moss',
      itemId: 'moss',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Crystal_Fruit',
      itemId: 'crystal_fruit',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Snow_Yam',
      itemId: 'snow_yam',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Crocus',
      itemId: 'crocus',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Ancient_Seed',
      itemId: 'ancient_seed',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Mystic_Syrup',
      itemId: 'mystic_syrup',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Acorn',
      itemId: 'acorn',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Maple_Seed',
      itemId: 'maple_seed',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Pine_Cone',
      itemId: 'pine_cone',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Mahogany_Seed',
      itemId: 'mahogany_seed',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Bug_Meat',
      itemId: 'bug_meat',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Prismatic_Shard',
      itemId: 'prismatic_shard',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Frozen_Tear',
      itemId: 'frozen_tear',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Diamond',
      itemId: 'diamond',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Morel',
      itemId: 'morel',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Chanterelle',
      itemId: 'chanterelle',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Garlic',
      itemId: 'garlic',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Oil',
      itemId: 'oil',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Bat_Wing',
      itemId: 'bat_wing',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Coral',
      itemId: 'coral',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Honey',
      itemId: 'honey',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Iridium_Ore',
      itemId: 'iridium_ore',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Truffle_Oil',
      itemId: 'truffle_oil',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Marble',
      itemId: 'marble',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Aquamarine',
      itemId: 'aquamarine',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Pumpkin',
      itemId: 'pumpkin',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Mixed_Seeds',
      itemId: 'mixed_seeds',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Cloth',
      itemId: 'cloth',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Red_Mushroom',
      itemId: 'red_mushroom',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Purple_Mushroom',
      itemId: 'purple_mushroom',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Fairy_Rose',
      itemId: 'fairy_rose',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Coconut',
      itemId: 'coconut',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Dragon_Tooth',
      itemId: 'dragon_tooth',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Ginger',
      itemId: 'ginger',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Cinder_Shard',
      itemId: 'cinder_shard',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Radioactive_Bar',
      itemId: 'radioactive_bar',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Sea_Urchin',
      itemId: 'sea_urchin',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Tulip_Bulb',
      itemId: 'tulip_bulb',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Jazz_Seeds',
      itemId: 'jazz_seeds',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Poppy_Seeds',
      itemId: 'poppy_seeds',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Spangle_Seeds',
      itemId: 'spangle_seeds',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Dwarf_Gadget',
      itemId: 'dwarf_gadget',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Quartz',
      itemId: 'quartz',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Corn',
      itemId: 'corn',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Sunflower',
      itemId: 'sunflower',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Sunflower_Seeds',
      itemId: 'sunflower_seeds',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Truffle',
      itemId: 'truffle',
      categories: ['raw_materials'],
      tags: []
    },
    {
      itemUrl: 'Wool',
      itemId: 'wool',
      categories: ['raw_materials'],
      tags: []
    }
  ]
};
