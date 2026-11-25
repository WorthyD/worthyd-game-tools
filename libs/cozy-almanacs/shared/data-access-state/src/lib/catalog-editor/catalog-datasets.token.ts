import { InjectionToken, ValueProvider } from '@angular/core';
import { CatalogDatasetSource } from '@cozy-almanacs/models';

/**
 * The datasets an app can load, first one active. Each app provides its own with `provideCatalogDatasets()`;
 * `CatalogDatasetLoader` fetches a dataset's JSON files the first time it's needed.
 */
export const CATALOG_DATASETS = new InjectionToken<CatalogDatasetSource[]>('CATALOG_DATASETS', {
  factory: () => []
});

export const provideCatalogDatasets = (datasets: CatalogDatasetSource[]): ValueProvider => ({
  provide: CATALOG_DATASETS,
  useValue: datasets
});
