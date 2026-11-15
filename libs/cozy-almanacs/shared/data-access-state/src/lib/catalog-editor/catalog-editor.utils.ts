import { Item } from '@cozy-almanacs/models';

/** Turns a label or item name into the lowercase snake case ids the catalog uses ("Storage Chests" → "storage_chests"). */
export const toCatalogId = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\W+/g, '_')
    .replace(/^_+|_+$/g, '');

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

/** Where new items expect their image, next to the existing `./images/<id>.png` files. */
export const ITEM_IMAGE_PATH = './images/';

/**
 * A draft item for a wiki page url ("https://stardewvalleywiki.com/Cherry_Bomb" → id `cherry_bomb`,
 * name "Cherry Bomb", a "Wiki Link" to the page and `./images/cherry_bomb.png`). Returns null when the
 * text isn't an http(s) url with a page name.
 */
export const itemFromUrl = (text: string): Item | null => {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  const page =
    url.pathname
      .split('/')
      .filter((part) => part)
      .pop() ?? '';
  let title = page;
  try {
    title = decodeURIComponent(page);
  } catch {
    // Keep the raw segment when it isn't valid percent-encoding.
  }
  const name = title.replace(/_/g, ' ').trim();
  const id = toCatalogId(name);
  if (!/^https?:$/.test(url.protocol) || !id) {
    return null;
  }
  return {
    ...createEmptyItem(),
    id,
    name,
    imageUrl: `${ITEM_IMAGE_PATH}${id}.png`,
    links: [{ text: 'Wiki Link', url: url.href }]
  };
};

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

/** A short, stable fingerprint of a JSON string (djb2), used to notice that the source files changed under a draft. */
export const hashString = (value: string): string => {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
};
