import { CatalogDataset } from '@cozy-almanacs/models';

/**
 * Cozy Almanacs is the hub for the game apps and ships no game data of its own. Each game app owns its
 * catalog and images (e.g. apps/stardew-cozy-almanacs/src/app/catalog/). The development build replaces
 * this file with the Stardew app's datasets.ts and serves its images (see `fileReplacements` and
 * `assets` in project.json), so `nx serve cozy-almanacs` can debug against real data.
 */
export const catalogDatasets: CatalogDataset[] = [];
