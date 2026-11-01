import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogStore } from '@crafting-cart/state';
import { items } from './catalog/items';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'craft-cart';

  private readonly catalog = inject(CatalogStore);

  constructor() {
    this.catalog.init(items);
  }
}
