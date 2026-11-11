import { CatalogDataset } from '@cozy-almanacs/models';
import { config } from './config';
import { items } from './items';

/** The catalogs the editor at /crafting-cart/config can open. Add another dataset here to edit it at /crafting-cart/config/<id>. */
export const catalogDatasets: CatalogDataset[] = [
  {
    id: 'stardew',
    name: 'Stardew Valley',
    config,
    items,
    files: {
      config: 'apps/cozy-almanacs/src/app/catalog/config.ts',
      items: 'apps/cozy-almanacs/src/app/catalog/items.ts'
    }
  }
];
