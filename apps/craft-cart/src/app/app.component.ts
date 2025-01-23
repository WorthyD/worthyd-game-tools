import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogFacade } from '@crafting-cart/shell';
import { items } from './catalog/items';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'craft-cart';

  constructor(private readonly cf: CatalogFacade) {
    this.cf.init(items);
  }
}
