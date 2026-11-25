import { Bundle, CatalogDataset } from '@cozy-almanacs/models';

/**
 * A small hand-rolled schema check for the catalog JSON files. TypeScript can't check JSON that is fetched at
 * runtime, so the loader runs these on every file and refuses data with the wrong shape. Unknown keys are allowed.
 */
type Check = (value: unknown, path: string, issues: string[]) => void;

interface Field {
  check: Check;
  optional: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const primitive =
  (type: 'string' | 'number'): Check =>
  (value, path, issues) => {
    if (typeof value !== type || (type === 'number' && !Number.isFinite(value))) {
      issues.push(`${path} should be a ${type}`);
    }
  };

const string = primitive('string');
const number = primitive('number');

const arrayOf =
  (check: Check): Check =>
  (value, path, issues) => {
    if (!Array.isArray(value)) {
      issues.push(`${path} should be an array`);
      return;
    }
    value.forEach((entry, i) => check(entry, `${path}[${i}]`, issues));
  };

const required = (check: Check): Field => ({ check, optional: false });
const optional = (check: Check): Field => ({ check, optional: true });

const object =
  (fields: Record<string, Field>): Check =>
  (value, path, issues) => {
    if (!isRecord(value)) {
      issues.push(`${path} should be an object`);
      return;
    }
    for (const [key, field] of Object.entries(fields)) {
      if (value[key] === undefined) {
        if (!field.optional) {
          issues.push(`${path}.${key} is missing`);
        }
      } else {
        field.check(value[key], `${path}.${key}`, issues);
      }
    }
  };

const strings = arrayOf(string);
const links = arrayOf(object({ text: required(string), url: required(string) }));
const label = object({ id: required(string), name: required(string), icon: required(string) });

const configCheck = object({ categories: required(arrayOf(label)), tags: required(arrayOf(label)) });

const itemCheck = object({
  id: required(string),
  name: required(string),
  description: required(string),
  imageUrl: required(string),
  links: required(links),
  ingredients: required(arrayOf(object({ id: required(string), quantity: required(number) }))),
  categories: required(strings),
  tags: required(strings)
});

const bundleItemCheck = object({
  id: optional(string),
  itemId: optional(string),
  name: optional(string),
  description: optional(string),
  imageUrl: optional(string),
  links: optional(links),
  quantity: optional(number)
});

const bundleCheck: Check = (value, path, issues) =>
  object({
    id: required(string),
    name: required(string),
    description: optional(string),
    imageUrl: optional(string),
    links: optional(links),
    items: optional(arrayOf(bundleItemCheck)),
    itemFilter: optional(object({ categories: optional(strings), tags: optional(strings) })),
    required: optional(number),
    bundles: optional(arrayOf(bundleCheck))
  })(value, path, issues);

const run = (check: Check, value: unknown, path: string): string[] => {
  const issues: string[] = [];
  check(value, path, issues);
  return issues;
};

/** Shape problems in a parsed `config.json`; empty when it is a valid `CatalogConfig`. */
export const catalogConfigIssues = (value: unknown): string[] => run(configCheck, value, 'config');

/** Shape problems in a parsed `items.json`; empty when it is a valid `Item[]`. */
export const catalogItemsIssues = (value: unknown): string[] => run(arrayOf(itemCheck), value, 'items');

/** Shape problems in a parsed `bundles.json`; empty when it is a valid `Bundle[]`. */
export const catalogBundlesIssues = (value: unknown): string[] => run(arrayOf(bundleCheck), value, 'bundles');

const duplicates = (ids: string[]): string[] => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].sort();

const flatten = (bundles: Bundle[]): Bundle[] =>
  bundles.flatMap((bundle) => [bundle, ...flatten(bundle.bundles ?? [])]);

/**
 * Broken references inside a loaded dataset: duplicate ids, labels that aren't defined, ingredients and bundle
 * items that aren't catalog items. The app still runs with these, so the loader doesn't reject them; each game
 * app's spec checks its shipped files have none.
 */
export const catalogReferenceIssues = ({ config, items, bundles = [] }: CatalogDataset): string[] => {
  const issues: string[] = [];
  const itemIds = new Set(items.map(({ id }) => id));
  const labels = {
    categories: new Set(config.categories.map(({ id }) => id)),
    tags: new Set(config.tags.map(({ id }) => id))
  };
  const report = (message: string, ids: string[]) => ids.length && issues.push(`${message}: ${ids.join(', ')}`);
  const unknownLabels = (kind: 'categories' | 'tags', ids: string[]) =>
    [...new Set(ids)].filter((id) => !labels[kind].has(id));

  report('Duplicate category ids', duplicates(config.categories.map(({ id }) => id)));
  report('Duplicate tag ids', duplicates(config.tags.map(({ id }) => id)));
  report('Duplicate item ids', duplicates(items.map(({ id }) => id)));
  report(
    'Items use undefined categories',
    unknownLabels(
      'categories',
      items.flatMap((item) => item.categories)
    )
  );
  report(
    'Items use undefined tags',
    unknownLabels(
      'tags',
      items.flatMap((item) => item.tags)
    )
  );
  report("Ingredients that aren't items", [
    ...new Set(items.flatMap((item) => item.ingredients.map(({ id }) => id)).filter((id) => !itemIds.has(id)))
  ]);

  const allBundles = flatten(bundles);
  report('Duplicate bundle ids', duplicates(allBundles.map(({ id }) => id)));
  report("Bundle items that aren't catalog items", [
    ...new Set(
      allBundles.flatMap((bundle) =>
        (bundle.items ?? []).flatMap(({ itemId }) => (itemId && !itemIds.has(itemId) ? [itemId] : []))
      )
    )
  ]);
  report(
    'Bundle filters use undefined categories',
    unknownLabels(
      'categories',
      allBundles.flatMap((bundle) => bundle.itemFilter?.categories ?? [])
    )
  );
  report(
    'Bundle filters use undefined tags',
    unknownLabels(
      'tags',
      allBundles.flatMap((bundle) => bundle.itemFilter?.tags ?? [])
    )
  );
  return issues;
};
