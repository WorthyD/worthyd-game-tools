import { CatalogDataset } from '@cozy-almanacs/models';
import { config } from './config';
import { items } from './items';

/**
 * The Stardew Valley catalog. The editor at /crafting-cart/config can open it, and the cozy-almanacs
 * development build swaps its own (empty) datasets.ts for this file so the hub app can debug against it.
 */
export const catalogDatasets: CatalogDataset[] = [
  {
    id: 'stardew',
    name: 'Stardew Valley',
    config,
    items,
    files: {
      config: 'apps/stardew-cozy-almanacs/src/app/catalog/config.ts',
      items: 'apps/stardew-cozy-almanacs/src/app/catalog/items.ts'
    }
  }
];
