import { Component, inject } from '@angular/core';

import { CartFacade, CatalogFacade } from '@crafting-cart/state';
import { PushPipe } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartQuantityComponent } from '@crafting-cart/shared/ui/cart-quantity';
import { ItemCardComponent } from '@crafting-cart/shared/ui/item-card';
import { DataViewerComponent, DataViewerConfig } from '@worthyd/shared/ui/data-viewer';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Item } from '@crafting-cart/shared/models';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'lib-catalog',
  imports: [
    CommonModule,
    PushPipe,
    MatButtonModule,
    MatCardModule,
    CartQuantityComponent,
    ItemCardComponent,
    DataViewerComponent,
    AsyncPipe
  ],
  template: `
    <!-- @if (catalogItems$ | ngrxPush; as catalogItems) {
        @for (catalogItem of catalogItems; track catalogItem.id) {
          <lib-item-card [catalogItem]="catalogItem">
            <lib-cart-quantity
              ngProjectAs="lib-item-card-footer"
              (add)="addToCart(catalogItem.id, $event)"
            ></lib-cart-quantity>
          </lib-item-card>
        }
      } -->
    <lib-data-viewer [dataViewerConfig]="(dataViewerConfig$ | async)!">
      <ng-template #cardTemplate let-data="data">
        <lib-item-card [catalogItem]="data">
          <lib-cart-quantity ngProjectAs="lib-item-card-footer" (add)="addToCart(data.id, $event)"></lib-cart-quantity>
        </lib-item-card>
      </ng-template>
    </lib-data-viewer>
  `,
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  readonly cf = inject(CatalogFacade);
  readonly cart = inject(CartFacade);
  catalogItems$ = this.cf.allCatalog$.pipe(startWith([]));
  cartItems$ = this.cart.allCart$;

  dataViewerConfig$: Observable<DataViewerConfig<Item>> = combineLatest([this.catalogItems$]).pipe(
    map(([catalogItems]) => ({
      data: catalogItems
    }))
  );

  addToCart(itemId: string, quantity: number) {
    this.cart.addItemToCart({ itemId, quantity: quantity });
  }
}
