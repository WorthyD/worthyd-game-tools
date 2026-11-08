import { Item, ItemLabel } from '@crafting-cart/shared/models';

/** A category or tag the catalog can be filtered by, with a readable label. */
export interface LabelOption extends ItemLabel {
  label: string;
}

/** Turns a config name such as `Artisan_Equipment` into `Artisan Equipment`. */
export const toLabelText = (name: string): string => name.replace(/_/g, ' ');

/**
 * Returns the config's categories or tags that at least one item uses, in config order,
 * so each game's catalog offers only its own labels and icons and never an empty filter.
 */
export function labelOptions(labels: ItemLabel[], items: Item[], key: 'categories' | 'tags'): LabelOption[] {
  const used = new Set(items.flatMap((item) => item[key] ?? []));
  return labels.filter((label) => used.has(label.id)).map((label) => ({ ...label, label: toLabelText(label.name) }));
}

/**
 * Keeps items that match any selected category id and any selected tag id.
 * An empty selection doesn't filter on that group.
 */
export function filterByLabels(items: Item[], categoryIds: string[], tagIds: string[]): Item[] {
  const matches = (ids: string[] | undefined, selected: string[]) =>
    selected.length === 0 || (ids ?? []).some((id) => selected.includes(id));

  return items.filter((item) => matches(item.categories, categoryIds) && matches(item.tags, tagIds));
}
