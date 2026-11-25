import { Item } from './item.interface';
import { CatalogConfig } from './catalog-config.interface';
import { Bundle } from './bundle.interface';

/** One URL or repo path for each of a dataset's JSON files. */
export interface CatalogDatasetFiles {
  config: string;
  items: string;
  bundles?: string;
}

/**
 * A dataset an app can load: its id, its name and where its JSON files are. Apps register theirs with
 * `provideCatalogDatasets()`, and `CatalogDatasetLoader` fetches the files the first time they're needed.
 */
export interface CatalogDatasetSource {
  id: string;
  name: string;
  /** Where the app fetches each JSON file from, relative to the base href (e.g. `catalog/stardew/items.json`). */
  urls: CatalogDatasetFiles;
  /** Where the files live in the repo, shown by the editors next to their exports. */
  files?: CatalogDatasetFiles;
}

/**
 * One game's data once loaded: its label definitions, its items and the bundles players can track.
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
