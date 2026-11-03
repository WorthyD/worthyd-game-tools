import { CatalogDataset } from '@crafting-cart/shared/models';
import { config } from './config';
import { items } from './items';

/** The catalogs the editor at /config can open. Add another dataset here to edit it at /config/<id>. */
export const catalogDatasets: CatalogDataset[] = [
  {
    id: 'stardew',
    name: 'Stardew Valley',
    config,
    items,
    files: {
      config: 'apps/craft-cart/src/app/catalog/config.ts',
      items: 'apps/craft-cart/src/app/catalog/items.ts'
    }
  }
];
