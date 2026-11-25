import { Bundle, CatalogConfig, Item } from '@cozy-almanacs/models';

const PRINT_WIDTH = 120;

type Json = string | number | boolean | null | undefined | Json[] | { [key: string]: Json };

interface JsonOptions {
  /** Keep objects whose values are all primitives on one line when they fit (e.g. `{ "id", "name", "icon" }` labels). */
  inlineFlatObjects: boolean;
}

const isPrimitive = (value: Json): boolean => value === null || typeof value !== 'object';

const entriesOf = (value: { [key: string]: Json }): [string, Json][] =>
  Object.entries(value).filter(([, entry]) => entry !== undefined);

const formatInline = (value: Json): string => {
  if (Array.isArray(value)) {
    return `[${value.map(formatInline).join(', ')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = entriesOf(value);
    return entries.length
      ? `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${formatInline(v)}`).join(', ')} }`
      : '{}';
  }
  return JSON.stringify(value) ?? 'null';
};

const canInline = (value: Json, options: JsonOptions): boolean => {
  if (isPrimitive(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    // Prettier breaks arrays of two or more objects, but keeps a single flat object inline when it fits.
    return (
      value.every(isPrimitive) || (value.length === 1 && options.inlineFlatObjects && canInline(value[0], options))
    );
  }
  const entries = entriesOf(value as { [key: string]: Json });
  return entries.length === 0 || (options.inlineFlatObjects && entries.every(([, entry]) => isPrimitive(entry)));
};

/**
 * Prints a value as JSON laid out like Prettier prints a `.json` file with this repo's `.prettierrc`,
 * so a generated file can replace the checked-in one without a noisy diff.
 * `prefix` is the text already on the line before the value (indent plus `"key": `).
 */
const formatJson = (value: Json, indent: string, prefix: string, suffix: string, options: JsonOptions): string => {
  const inline = formatInline(value);
  if (
    isPrimitive(value) ||
    (canInline(value, options) && prefix.length + inline.length + suffix.length <= PRINT_WIDTH)
  ) {
    return inline;
  }

  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    const lines = value.map(
      (entry, i) => `${inner}${formatJson(entry, inner, inner, i < value.length - 1 ? ',' : '', options)}`
    );
    return `[\n${lines.join(',\n')}\n${indent}]`;
  }

  const entries = entriesOf(value as { [key: string]: Json });
  const lines = entries.map(([key, entry], i) => {
    const keyText = `${inner}${JSON.stringify(key)}: `;
    return `${keyText}${formatJson(entry, inner, keyText, i < entries.length - 1 ? ',' : '', options)}`;
  });
  return `{\n${lines.join(',\n')}\n${indent}}`;
};

const toJsonFile = (value: unknown, options: JsonOptions): string =>
  `${formatJson(value as Json, '', '', '', options)}\n`;

/** The full contents of a dataset's `config.json`. */
export const createConfigFile = (config: CatalogConfig): string => toJsonFile(config, { inlineFlatObjects: true });

/** The full contents of a dataset's `items.json`. */
export const createItemsFile = (items: Item[]): string => toJsonFile(items, { inlineFlatObjects: false });

/** The full contents of a dataset's `bundles.json`. */
export const createBundlesFile = (bundles: Bundle[]): string => toJsonFile(bundles, { inlineFlatObjects: true });
