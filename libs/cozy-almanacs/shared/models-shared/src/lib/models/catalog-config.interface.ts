import { ItemCategory, ItemTag } from './item-label.interface';

/** A catalog's label definitions. Items refer to these by id. */
export interface CatalogConfig {
  categories: ItemCategory[];
  tags: ItemTag[];
}
