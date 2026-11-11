import { Item, ItemConfig } from '@cozy-almanacs/models';

/** Turns a label or item name into the lowercase snake case ids the catalog uses ("Storage Chests" → "storage_chests"). */
export const toCatalogId = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\W+/g, '_')
    .replace(/^_+|_+$/g, '');

/** Strips the config's base url from a pasted wiki url ("https://stardewvalleywiki.com/Cherry_Bomb" → "Cherry_Bomb"). */
export const toItemUrl = (url: string, baseUrl: string): string => {
  const trimmed = url.trim();
  return baseUrl && trimmed.startsWith(baseUrl) ? trimmed.slice(baseUrl.length) : trimmed;
};

/** The item id implied by an item url: its last path segment as a catalog id. */
export const itemIdFromUrl = (itemUrl: string): string =>
  toCatalogId(
    itemUrl
      .split('/')
      .filter((part) => part)
      .pop() ?? ''
  );

/** Ingredients as editable text: `copper_ore:4, coal:1`. */
export const formatIngredients = (ingredients: Item['ingredients']): string =>
  ingredients.map(({ id, quantity }) => `${id}:${quantity}`).join(', ');

/** Parses `copper_ore:4, coal` (a missing quantity means 1). */
export const parseIngredients = (text: string): Item['ingredients'] =>
  text
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part)
    .map((part) => {
      const [id, quantity] = part.split(':').map((piece) => piece.trim());
      const parsed = Number(quantity);
      return { id, quantity: quantity && Number.isFinite(parsed) && parsed > 0 ? parsed : 1 };
    });

/** Links as editable text, one `text | url` per line. */
export const formatLinks = (links: Item['links']): string =>
  links.map(({ text, url }) => `${text} | ${url}`).join('\n');

/** Parses one `text | url` per line; a line with only a url gets the text "Link". */
export const parseLinks = (text: string): Item['links'] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => {
      const separator = line.lastIndexOf('|');
      return separator === -1
        ? { text: 'Link', url: line }
        : { text: line.slice(0, separator).trim(), url: line.slice(separator + 1).trim() };
    });

export const createEmptyItem = (): Item => ({
  id: '',
  name: '',
  description: '',
  imageUrl: '',
  links: [],
  categories: [],
  tags: [],
  ingredients: []
});

export const createEmptyItemConfig = (): ItemConfig => ({
  itemUrl: '',
  itemId: '',
  categories: [],
  tags: []
});

/** A short, stable fingerprint of a JSON string (djb2), used to notice that the source files changed under a draft. */
export const hashString = (value: string): string => {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
};
