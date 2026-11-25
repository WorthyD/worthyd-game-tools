import { CatalogDatasetSource } from '@cozy-almanacs/models';

const assets = 'apps/stardew-cozy-almanacs/src/assets';

/**
 * The Stardew Valley catalog and bundles. The data is JSON in `src/assets/catalog/stardew/`, fetched at runtime
 * the first time it's needed, so it stays out of the JavaScript bundle. The editors at /crafting-cart/config and
 * /bundles/config open it and export replacements for those files. The cozy-almanacs development build swaps its
 * own (empty) datasets.ts for this file and serves these assets, so the hub app can debug against it.
 */
export const catalogDatasets: CatalogDatasetSource[] = [
  {
    id: 'stardew',
    name: 'Stardew Valley',
    urls: {
      config: 'catalog/stardew/config.json',
      items: 'catalog/stardew/items.json',
      bundles: 'catalog/stardew/bundles.json'
    },
    files: {
      config: `${assets}/catalog/stardew/config.json`,
      items: `${assets}/catalog/stardew/items.json`,
      bundles: `${assets}/catalog/stardew/bundles.json`
    }
  }
];
