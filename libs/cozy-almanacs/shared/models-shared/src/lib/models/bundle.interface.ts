import { Item } from './item.interface';

/**
 * One thing to track in a bundle.
 * - A catalog item: set `itemId`. Its name, image, description and links come from the catalog.
 * - A one-off that isn't in the catalog (a secret note, a golden walnut): leave out `itemId` and set
 *   `id`, `name` and usually `imageUrl` and `links`.
 *
 * Fields set here win over the catalog item's, e.g. a `description` saying where to find it.
 */
export interface BundleItem {
  /** Unique within the bundle. Defaults to `itemId`, so it's only needed for one-offs or repeats. */
  id?: string;
  /** Id of an item in the catalog (`Item.id`). */
  itemId?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  links?: Item['links'];
  /** How many are needed. Defaults to 1. */
  quantity?: number;
}

/**
 * Adds every catalog item that matches, e.g. `{ categories: ['cooking'] }` for "Recipes cooked".
 * An item matches when it has any listed category and any listed tag; an empty list doesn't filter.
 */
export interface BundleItemFilter {
  categories?: string[];
  tags?: string[];
}

/**
 * A list of things to track: a Community Center bundle, "Secret notes found", "Recipes cooked".
 * A bundle can also group other bundles (a room holding its bundles), nested as deep as needed.
 */
export interface Bundle {
  /** Unique across the dataset, including nested bundles. Saved progress is keyed by it. */
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  links?: Item['links'];
  items?: BundleItem[];
  /** Adds catalog items by category or tag, after `items`. */
  itemFilter?: BundleItemFilter;
  /** How many items complete the bundle ("any 5 of these 9"). Defaults to all of them. */
  required?: number;
  /** Child bundles. */
  bundles?: Bundle[];
}
