import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CatalogDataset } from '@cozy-almanacs/models';
import {
  catalogBundlesIssues,
  catalogConfigIssues,
  catalogItemsIssues,
  catalogReferenceIssues
} from '@cozy-almanacs/state';
import { catalogDatasets } from './datasets';

/** The app's `src/` folder, which the dataset urls resolve against (its assets are served from the root). */
const src = join(__dirname, '../..');
const workspaceRoot = join(src, '../../..');
const readJson = (url: string): unknown => JSON.parse(readFileSync(join(src, 'assets', url), 'utf8'));

describe('Stardew catalog datasets', () => {
  it.each(catalogDatasets.map((source) => [source.id, source] as const))('%s points at its JSON files', (_, source) => {
    for (const [kind, url] of Object.entries(source.urls)) {
      expect(existsSync(join(src, 'assets', url))).toBe(true);
      // The editors show `files` as the place to paste their exports, so it must be the same file.
      expect(join(workspaceRoot, source.files?.[kind as keyof typeof source.urls] ?? '')).toBe(
        join(src, 'assets', url)
      );
    }
  });

  it.each(catalogDatasets.map((source) => [source.id, source] as const))(
    '%s matches the catalog schema and has no broken references',
    (_, source) => {
      const config = readJson(source.urls.config);
      const items = readJson(source.urls.items);
      const bundles = source.urls.bundles ? readJson(source.urls.bundles) : [];

      expect([...catalogConfigIssues(config), ...catalogItemsIssues(items), ...catalogBundlesIssues(bundles)]).toEqual(
        []
      );
      const dataset = { id: source.id, name: source.name, config, items, bundles } as CatalogDataset;
      expect(catalogReferenceIssues(dataset)).toEqual([]);
    }
  );
});
