import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BundleStore, CatalogStore } from '@cozy-almanacs/state';
import { catalogDatasets } from './catalog/datasets';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cozy-almanacs';

  private readonly catalog = inject(CatalogStore);
  private readonly bundles = inject(BundleStore);

  constructor() {
    const [dataset] = catalogDatasets;
    this.catalog.init(dataset?.items ?? [], dataset?.config ?? { categories: [], tags: [] });
    this.bundles.init(dataset?.id ?? '', dataset?.bundles ?? []);
  }
}
