import { Item } from './item.interface';
import { CatalogConfig } from './catalog-config.interface';
import { Bundle } from './bundle.interface';

/** Where a dataset's files live in the repo, shown by the editors next to their exports. */
export interface CatalogDatasetFiles {
  config: string;
  items: string;
  bundles?: string;
}

/**
 * One game's data: its label definitions, its items and the bundles players can track.
 * The editors key their local-storage drafts by `id`, so each dataset keeps its own draft.
 */
export interface CatalogDataset {
  id: string;
  name: string;
  config: CatalogConfig;
  items: Item[];
  bundles?: Bundle[];
  files?: CatalogDatasetFiles;
}
