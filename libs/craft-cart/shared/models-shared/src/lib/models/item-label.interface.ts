/**
 * A category or tag shown on an item. `icon` is a Material Symbols name from https://fonts.google.com/icons
 * (rendered with `<mat-icon>`), and `name` is the identifier item configs refer to.
 */
export interface ItemLabel {
  name: string;
  icon: string;
}

export type ItemCategory = ItemLabel;
export type ItemTag = ItemLabel;
