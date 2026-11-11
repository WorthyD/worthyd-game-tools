import { Item, ScraperConfig } from '@cozy-almanacs/models';

const PRINT_WIDTH = 120;
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

type Literal = string | number | boolean | null | undefined | Literal[] | { [key: string]: Literal };

interface LiteralOptions {
  /** Keep objects whose values are all primitives on one line when they fit (e.g. `{ id, name, icon }` labels). */
  inlineFlatObjects: boolean;
}

const isPrimitive = (value: Literal): boolean => value === null || typeof value !== 'object';

/** Quotes a string the way Prettier does with `singleQuote`: single quotes unless that needs more escapes. */
export const quoteString = (value: string): string => {
  const singles = (value.match(/'/g) ?? []).length;
  const doubles = (value.match(/"/g) ?? []).length;
  const quote = singles > doubles ? '"' : "'";
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(new RegExp(quote, 'g'), `\\${quote}`);
  return `${quote}${escaped}${quote}`;
};

const formatKey = (key: string): string => (IDENTIFIER.test(key) ? key : quoteString(key));

const entriesOf = (value: { [key: string]: Literal }): [string, Literal][] =>
  Object.entries(value).filter(([, entry]) => entry !== undefined);

const formatInline = (value: Literal): string => {
  if (typeof value === 'string') {
    return quoteString(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(formatInline).join(', ')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = entriesOf(value);
    return entries.length ? `{ ${entries.map(([k, v]) => `${formatKey(k)}: ${formatInline(v)}`).join(', ')} }` : '{}';
  }
  return String(value);
};

const canInline = (value: Literal, options: LiteralOptions): boolean => {
  if (isPrimitive(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isPrimitive);
  }
  const entries = entriesOf(value as { [key: string]: Literal });
  return entries.length === 0 || (options.inlineFlatObjects && entries.every(([, entry]) => isPrimitive(entry)));
};

/**
 * Prints a value as a TypeScript literal laid out like Prettier would print it with this repo's `.prettierrc`,
 * so a generated file can replace the checked-in one without a noisy diff.
 * `prefix` is the text already on the line before the value (indent plus `key: `).
 */
const formatLiteral = (
  value: Literal,
  indent: string,
  prefix: string,
  suffix: string,
  options: LiteralOptions
): string => {
  const inline = formatInline(value);
  if (canInline(value, options) && prefix.length + inline.length + suffix.length <= PRINT_WIDTH) {
    return inline;
  }
  if (typeof value === 'string' && prefix.trim().endsWith(':')) {
    // Prettier moves a string that doesn't fit after its key onto the next line.
    return `\n${indent}  ${inline}`;
  }
  if (isPrimitive(value)) {
    return inline;
  }

  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    const lines = value.map(
      (entry, i) => `${inner}${formatLiteral(entry, inner, inner, i < value.length - 1 ? ',' : '', options)}`
    );
    return `[\n${lines.join(',\n')}\n${indent}]`;
  }

  const entries = entriesOf(value as { [key: string]: Literal });
  const lines = entries.map(([key, entry], i) => {
    const keyText = `${inner}${formatKey(key)}: `;
    const printed = formatLiteral(entry, inner, keyText, i < entries.length - 1 ? ',' : '', options);
    return printed.startsWith('\n') ? `${keyText.trimEnd()}${printed}` : `${keyText}${printed}`;
  });
  return `{\n${lines.join(',\n')}\n${indent}}`;
};

const toLiteral = (value: unknown): Literal => value as Literal;

/** The full contents of `config.ts` for a dataset. */
export const createConfigFile = (config: ScraperConfig): string =>
  `import { ScraperConfig } from '@cozy-almanacs/models';\n` +
  `export const config: ScraperConfig = ${formatLiteral(toLiteral(config), '', 'export const config: ScraperConfig = ', ';', { inlineFlatObjects: true })};\n`;

/** The full contents of `items.ts` for a dataset. */
export const createItemsFile = (items: Item[]): string =>
  `export const items = ${formatLiteral(toLiteral(items), '', 'export const items = ', ';', { inlineFlatObjects: false })};\n`;
