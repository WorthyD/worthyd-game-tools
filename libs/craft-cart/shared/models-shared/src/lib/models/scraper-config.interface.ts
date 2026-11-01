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
  tags: string[];
  categories: string[];
  items: ItemConfig[];
}
