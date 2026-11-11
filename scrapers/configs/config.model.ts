// Ensure this matches ItemLabel in libs/cozy-almanacs/shared/models-shared/src/lib/models/item-label.interface.ts
export interface ItemLabel {
  id: string;
  name: string;
  icon: string;
}

export interface ItemConfig {
  itemUrl: string;
  itemId: string;
  /** Ids of entries in `ScraperConfig.categories`. */
  categories: string[];
  /** Ids of entries in `ScraperConfig.tags`. */
  tags: string[];
  extraLinks?: { text: string; url: string }[];
}
export interface ScraperConfig {
  baseUrl: string;
  imagePath: string;
  assetPath: string;
  configOutputPath: string;
  tags: ItemLabel[];
  categories: ItemLabel[];
  items: ItemConfig[];
}

// Ensure this matches the Item interface in libs/cozy-almanacs/shared/models-shared/src/lib/models/item.interface.ts
export interface ItemOutput {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  links: { text: string; url: string }[];
  ingredients: { id: string; quantity: number }[];
  /** Ids of entries in `ScraperConfig.categories`. */
  categories: string[];
  /** Ids of entries in `ScraperConfig.tags`. */
  tags: string[];
}
