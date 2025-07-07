export interface ItemConfig {
  itemUrl: string;
  itemId: string;
  categories: string[];
  tags: string[];
  extraLinks?: { text: string; url: string }[];
}
export interface ScraperConfig {
  baseUrl: string;
  imagePath: string;
  assetPath: string;
  configOutputPath: string;
  items: ItemConfig[];
}

// Ensure this matches the Item interface in libs/craft-cart/shared/models/src/lib/models/item.interface.ts
export interface ItemOutput {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  links: { text: string; url: string }[];
  ingredients: { id: string; quantity: number }[];
  categories: string[];
  tags: string[];
}
