import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Bundle, CatalogConfig, CatalogDataset, CatalogDatasetSource, Item } from '@cozy-almanacs/models';
import { BundleStore } from '../bundles/bundle.store';
import { CatalogStore } from '../catalog/catalog.store';
import { CATALOG_DATASETS } from '../catalog-editor/catalog-datasets.token';
import { catalogBundlesIssues, catalogConfigIssues, catalogItemsIssues } from './catalog-schema';

/**
 * Fetches the catalog JSON files registered with `provideCatalogDatasets()`. Each dataset is fetched once and
 * shared, so the app, the catalog editor and the bundle editor all reuse the same request. Files that don't match
 * the catalog schema are rejected with the list of problems.
 */
@Injectable({ providedIn: 'root' })
export class CatalogDatasetLoader {
  private readonly http = inject(HttpClient);
  private readonly catalog = inject(CatalogStore);
  private readonly bundles = inject(BundleStore);
  private readonly cache = new Map<string, Promise<CatalogDataset>>();

  /** The registered datasets, in order. The first one is the app's active dataset. */
  readonly sources = inject(CATALOG_DATASETS);

  /** The registered dataset with this id, or the first one when `id` is empty. */
  source(id?: string | null): CatalogDatasetSource | undefined {
    return id ? this.sources.find((source) => source.id === id) : this.sources[0];
  }

  /** Loads a dataset's files (once) and checks them against the catalog schema. */
  load(source: CatalogDatasetSource): Promise<CatalogDataset> {
    let dataset = this.cache.get(source.id);
    if (!dataset) {
      dataset = this.fetch(source);
      // Forget failures so the next call tries again.
      dataset.catch(() => this.cache.delete(source.id));
      this.cache.set(source.id, dataset);
    }
    return dataset;
  }

  /**
   * Loads the active (first) dataset into the `CatalogStore` and `BundleStore`. An app without datasets gets an
   * empty catalog. Resolves to false, leaving the stores as they were, when the files can't be loaded.
   */
  async loadActive(): Promise<boolean> {
    if (this.catalog.loaded()) {
      return true;
    }
    const source = this.source();
    try {
      const dataset = source ? await this.load(source) : null;
      this.catalog.init(dataset?.items ?? [], dataset?.config ?? { categories: [], tags: [] });
      this.bundles.init(dataset?.id ?? '', dataset?.bundles ?? []);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async fetch({ id, name, urls, files }: CatalogDatasetSource): Promise<CatalogDataset> {
    const [config, items, bundles] = await Promise.all([
      this.get<CatalogConfig>(urls.config, catalogConfigIssues),
      this.get<Item[]>(urls.items, catalogItemsIssues),
      urls.bundles ? this.get<Bundle[]>(urls.bundles, catalogBundlesIssues) : Promise.resolve([])
    ]);
    return { id, name, config, items, bundles, files };
  }

  private async get<T>(url: string, issuesOf: (value: unknown) => string[]): Promise<T> {
    const value = await firstValueFrom(this.http.get<unknown>(url));
    const issues = issuesOf(value);
    if (issues.length) {
      const more = issues.length > 10 ? `\n…and ${issues.length - 10} more` : '';
      throw new Error(`${url} doesn't match the catalog schema:\n${issues.slice(0, 10).join('\n')}${more}`);
    }
    return value as T;
  }
}
