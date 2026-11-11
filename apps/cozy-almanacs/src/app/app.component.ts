import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogStore } from '@cozy-almanacs/state';
import { config } from './catalog/config';
import { items } from './catalog/items';

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

  constructor() {
    this.catalog.init(items, { categories: config.categories, tags: config.tags });
  }
}
