import { Bundle, BundleItem, BundleItemFilter, BundleProgress, Item } from '@cozy-almanacs/models';

/** A path to a bundle in a nested list: `[2, 0]` is the first child of the third top-level bundle. */
export type BundlePath = number[];

/** A bundle item's id within its bundle: `id`, or else `itemId`. */
export const bundleItemKey = (item: BundleItem): string => item.id || item.itemId || '';

/** The key a bundle item's progress is saved under. */
export const bundleProgressKey = (bundleId: string, itemKey: string): string => `${bundleId}/${itemKey}`;

/** A bundle item with the catalog filled in, ready to show. */
export interface ResolvedBundleItem {
  key: string;
  progressKey: string;
  /** Set when the item is in the catalog, so it can go in the cart. */
  itemId?: string;
  name: string;
  description: string;
  imageUrl: string;
  links: Item['links'];
  quantity: number;
  collected: boolean;
  turnedIn: boolean;
}

export interface ResolvedBundle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  links: Item['links'];
  items: ResolvedBundleItem[];
  bundles: ResolvedBundle[];
  /** Items needed to complete this bundle's own list. */
  required: number;
  collected: number;
  turnedIn: number;
  /** This bundle and all of its child bundles are complete (and there is something to complete). */
  complete: boolean;
  /** Totals over this bundle and every bundle inside it, for progress bars. */
  totalRequired: number;
  totalCollected: number;
}

/** Catalog items a filter adds. A filter with no categories and no tags adds nothing. */
export const filterCatalogItems = (items: Item[], filter: BundleItemFilter | undefined): Item[] => {
  const categories = filter?.categories ?? [];
  const tags = filter?.tags ?? [];
  if (!categories.length && !tags.length) {
    return [];
  }
  const matches = (ids: string[], selected: string[]) =>
    selected.length === 0 || ids.some((id) => selected.includes(id));
  return items.filter((item) => matches(item.categories, categories) && matches(item.tags, tags));
};

/** A bundle's own items, including the ones its filter adds (skipping any already listed). */
export const bundleItems = (bundle: Bundle, catalog: Item[]): BundleItem[] => {
  const listed = bundle.items ?? [];
  const keys = new Set(listed.map(bundleItemKey));
  const filtered = filterCatalogItems(catalog, bundle.itemFilter)
    .filter((item) => !keys.has(item.id))
    .map((item): BundleItem => ({ itemId: item.id }));
  return [...listed, ...filtered];
};

/** Fills in each bundle's items from the catalog and the player's progress. */
export const resolveBundles = (bundles: Bundle[], catalog: Item[], progress: BundleProgress): ResolvedBundle[] => {
  const catalogMap = new Map(catalog.map((item) => [item.id, item]));

  const resolveItem = (bundleId: string, item: BundleItem): ResolvedBundleItem => {
    const key = bundleItemKey(item);
    const progressKey = bundleProgressKey(bundleId, key);
    const catalogItem = item.itemId ? catalogMap.get(item.itemId) : undefined;
    const saved = progress[progressKey];
    return {
      key,
      progressKey,
      itemId: catalogItem?.id,
      name: item.name || catalogItem?.name || key,
      description: item.description ?? catalogItem?.description ?? '',
      imageUrl: item.imageUrl ?? catalogItem?.imageUrl ?? '',
      links: item.links ?? catalogItem?.links ?? [],
      quantity: item.quantity ?? 1,
      collected: !!(saved?.collected || saved?.turnedIn),
      turnedIn: !!saved?.turnedIn
    };
  };

  const resolve = (bundle: Bundle): ResolvedBundle => {
    const items = bundleItems(bundle, catalog).map((item) => resolveItem(bundle.id, item));
    const children = (bundle.bundles ?? []).map(resolve);
    const required = Math.min(bundle.required ?? items.length, items.length);
    const collected = Math.min(items.filter((item) => item.collected).length, required);
    const totalRequired = required + children.reduce((sum, child) => sum + child.totalRequired, 0);
    return {
      id: bundle.id,
      name: bundle.name,
      description: bundle.description ?? '',
      imageUrl: bundle.imageUrl ?? '',
      links: bundle.links ?? [],
      items,
      bundles: children,
      required,
      collected,
      turnedIn: items.filter((item) => item.turnedIn).length,
      // A bundle with nothing in it yet isn't complete.
      complete:
        totalRequired > 0 && collected >= required && children.every((child) => child.complete || !child.totalRequired),
      totalRequired,
      totalCollected: collected + children.reduce((sum, child) => sum + child.totalCollected, 0)
    };
  };

  return bundles.map(resolve);
};

/** Every bundle in a nested list, parents before their children. */
export const flattenBundles = <T extends { bundles?: T[] }>(bundles: T[]): T[] =>
  bundles.flatMap((bundle) => [bundle, ...flattenBundles(bundle.bundles ?? [])]);

export const bundleAt = (bundles: Bundle[], path: BundlePath): Bundle | undefined => {
  const [index, ...rest] = path;
  const bundle = bundles[index];
  return bundle && rest.length ? bundleAt(bundle.bundles ?? [], rest) : bundle;
};

/** Returns a copy of `bundles` with the list that holds `path`'s bundle changed by `change`. */
export const updateSiblings = (
  bundles: Bundle[],
  path: BundlePath,
  change: (siblings: Bundle[], index: number) => Bundle[]
): Bundle[] => {
  const [index, ...rest] = path;
  if (!rest.length) {
    return change(bundles, index);
  }
  return bundles.map((bundle, i) =>
    i === index ? withChildren(bundle, updateSiblings(bundle.bundles ?? [], rest, change)) : bundle
  );
};

export const updateBundleAt = (bundles: Bundle[], path: BundlePath, change: (bundle: Bundle) => Bundle): Bundle[] =>
  updateSiblings(bundles, path, (siblings, index) => siblings.map((b, i) => (i === index ? change(b) : b)));

const withChildren = (bundle: Bundle, children: Bundle[]): Bundle => {
  const next: Bundle = { ...bundle, bundles: children };
  if (!children.length) {
    delete next.bundles;
  }
  return next;
};

/** Swaps the entry at `index` with its neighbour; does nothing at either end. */
export const moveEntry = <T>(list: T[], index: number, offset: -1 | 1): T[] => {
  const to = index + offset;
  if (index < 0 || index >= list.length || to < 0 || to >= list.length) {
    return list;
  }
  const next = [...list];
  [next[index], next[to]] = [next[to], next[index]];
  return next;
};

/**
 * Drops empty optional fields so the exported file stays short: blank strings, empty lists,
 * empty filters, and `quantity: 1`.
 */
export const compactBundleItem = (item: BundleItem): BundleItem => {
  const next: BundleItem = { ...item };
  (['id', 'itemId', 'name', 'description', 'imageUrl'] as const).forEach((key) => {
    if (!next[key]?.trim()) {
      delete next[key];
    }
  });
  if (next.id && next.id === next.itemId) {
    delete next.id;
  }
  if (!next.links?.length) {
    delete next.links;
  }
  if (next.quantity === undefined || next.quantity === null || next.quantity === 1 || Number.isNaN(next.quantity)) {
    delete next.quantity;
  }
  return next;
};

export const compactBundle = (bundle: Bundle): Bundle => {
  const next: Bundle = { ...bundle };
  (['description', 'imageUrl'] as const).forEach((key) => {
    if (!next[key]?.trim()) {
      delete next[key];
    }
  });
  if (!next.links?.length) {
    delete next.links;
  }
  if (!next.items?.length) {
    delete next.items;
  }
  if (!next.bundles?.length) {
    delete next.bundles;
  }
  const filter: BundleItemFilter = {};
  if (next.itemFilter?.categories?.length) {
    filter.categories = next.itemFilter.categories;
  }
  if (next.itemFilter?.tags?.length) {
    filter.tags = next.itemFilter.tags;
  }
  if (filter.categories || filter.tags) {
    next.itemFilter = filter;
  } else {
    delete next.itemFilter;
  }
  if (next.required === undefined || next.required === null || Number.isNaN(next.required) || next.required < 1) {
    delete next.required;
  }
  return next;
};
