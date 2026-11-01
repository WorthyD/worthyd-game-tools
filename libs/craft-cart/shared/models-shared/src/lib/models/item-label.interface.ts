/**
 * A category or tag, defined once in the catalog config (`ScraperConfig.categories` / `ScraperConfig.tags`).
 * Items and item configs refer to it by `id`, so changing `name` or `icon` here updates it everywhere.
 * `icon` is a Material Symbols name from https://fonts.google.com/icons (rendered with `<mat-icon>`).
 */
export interface ItemLabel {
  id: string;
  name: string;
  icon: string;
}

export type ItemCategory = ItemLabel;
export type ItemTag = ItemLabel;
