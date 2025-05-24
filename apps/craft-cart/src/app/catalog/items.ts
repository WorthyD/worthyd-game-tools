import { Item } from '@crafting-cart/shared/models';

export const items: Item[] = [
  {
    id: 'cherry_bomb',
    name: 'Cherry Bomb',
    description: 'Generates a small explosion. Stand back!',
    imageUrl: './images/cherry_bomb.png',
    ingredients: [
      { id: 'copper_ore', quantity: 4 },
      { id: 'coal', quantity: 1 }
    ],
    links: []
  },
  {
    id: 'coal',
    name: 'Coal',
    description: 'A combustible rock that is useful for crafting and smelting.',
    imageUrl: './images/coal.png',
    ingredients: [],
    links: []
  },
  {
    id: 'copper_ore',
    name: 'Copper Ore',
    description: 'A common ore that can be smelted into bars.',
    imageUrl: './images/copper_ore.png',
    ingredients: [],
    links: []
  }
];

/*
,{
    id: '',
    name: '',
    description: '',
    imageUrl: '',
    ingredients: [],
    links: []

}
    */
