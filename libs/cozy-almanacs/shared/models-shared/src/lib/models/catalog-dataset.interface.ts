import { Item } from './item.interface';
import { CatalogConfig } from './catalog-config.interface';

/** Where a dataset's files live in the repo, shown by the catalog editor next to its exports. */
export interface CatalogDatasetFiles {
  config: string;
  items: string;
}

/**
 * One editable catalog: its label definitions plus its items.
 * The editor keys its local-storage draft by `id`, so each dataset keeps its own draft.
 */
export interface CatalogDataset {
  id: string;
  name: string;
  config: CatalogConfig;
  items: Item[];
  files?: CatalogDatasetFiles;
}
