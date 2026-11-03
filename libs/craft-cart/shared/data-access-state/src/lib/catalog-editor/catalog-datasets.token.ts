import { InjectionToken, ValueProvider } from '@angular/core';
import { CatalogDataset } from '@crafting-cart/shared/models';

/** The catalogs the editor can open. Each app provides its own with `provideCatalogDatasets()`. */
export const CATALOG_DATASETS = new InjectionToken<CatalogDataset[]>('CATALOG_DATASETS', {
  factory: () => []
});

export const provideCatalogDatasets = (datasets: CatalogDataset[]): ValueProvider => ({
  provide: CATALOG_DATASETS,
  useValue: datasets
});
