import { ItemCategory, ItemTag } from './item-label.interface';

export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  links: { text: string; url: string }[];
  ingredients: { id: string; quantity: number }[];
  categories: ItemCategory[];
  tags: ItemTag[];
}
