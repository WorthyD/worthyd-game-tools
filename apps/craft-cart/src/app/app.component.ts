import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogFacade } from '@crafting-cart/state';
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

  constructor(private readonly cf: CatalogFacade) {
    this.cf.init(items);
  }
}
