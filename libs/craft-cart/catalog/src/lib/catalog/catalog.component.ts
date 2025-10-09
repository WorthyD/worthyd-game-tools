import { Component, inject } from '@angular/core';

import { CartFacade, CatalogFacade } from '@crafting-cart/state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CartQuantityComponent } from '@crafting-cart/shared/ui/cart-quantity';
import { ItemCardComponent } from '@crafting-cart/shared/ui/item-card';
import { DataViewerComponent, DataViewerConfig } from '@worthyd/shared/ui/data-viewer';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Item } from '@crafting-cart/shared/models';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
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
      <!-- Default to card view if no template is provided -->
      <ng-template #cardTemplate let-data="data">
        <lib-item-card [catalogItem]="data">
          <lib-cart-quantity ngProjectAs="lib-item-card-footer" (add)="addToCart(data.id, $event)"></lib-cart-quantity>
        </lib-item-card>
      </ng-template>




      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element">{{ element.id }}</td>
      </ng-container>
      <!-- Column definitions -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <!-- <ng-container matColumnDef="quantity" [matColumnDef]="'quantity'">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let row">
          <lib-cart-quantity (add)="addToCart(row.id, $event)"></lib-cart-quantity>
        </td>
      </ng-container> -->
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
      data: catalogItems,
      columns: ['id', 'name']  // Add all the columns you want to display
    }))
  );

  addToCart(itemId: string, quantity: number) {
    this.cart.addItemToCart({ itemId, quantity: quantity });
  }
}
