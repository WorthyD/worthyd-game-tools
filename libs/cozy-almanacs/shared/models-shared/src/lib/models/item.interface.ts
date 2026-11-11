export interface Item {
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
