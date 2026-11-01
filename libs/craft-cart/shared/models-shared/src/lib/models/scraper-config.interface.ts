import { ItemCategory, ItemTag } from './item-label.interface';

export interface ItemConfig {
  itemUrl: string;
  itemId: string;
  /** Names of entries in `ScraperConfig.categories`. */
  categories: string[];
  /** Names of entries in `ScraperConfig.tags`. */
  tags: string[];
  extraLinks?: { text: string; url: string }[];
}
export interface ScraperConfig {
  baseUrl: string;
  imagePath: string;
  assetPath: string;
  configOutputPath: string;
  tags: ItemTag[];
  categories: ItemCategory[];
  items: ItemConfig[];
}
