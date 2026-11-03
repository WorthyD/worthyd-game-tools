import { Item } from './item.interface';
import { ScraperConfig } from './scraper-config.interface';

/** Where a dataset's files live in the repo, shown by the catalog editor next to its exports. */
export interface CatalogDatasetFiles {
  config: string;
  items: string;
}

/**
 * One editable catalog: the scraper config (labels and item urls) plus the scraped items.
 * The editor keys its local-storage draft by `id`, so each dataset keeps its own draft.
 */
export interface CatalogDataset {
  id: string;
  name: string;
  config: ScraperConfig;
  items: Item[];
  files?: CatalogDatasetFiles;
}
