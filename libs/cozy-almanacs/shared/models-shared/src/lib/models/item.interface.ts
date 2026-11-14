export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  links: { text: string; url: string }[];
  ingredients: { id: string; quantity: number }[];
  /** Ids of entries in `CatalogConfig.categories`. */
  categories: string[];
  /** Ids of entries in `CatalogConfig.tags`. */
  tags: string[];
}
