import { Component, inject, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CartFacade, CatalogFacade } from '@crafting-cart/state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CartQuantityComponent } from '@crafting-cart/shared/ui/cart-quantity';
import { ItemCardComponent } from '@crafting-cart/shared/ui/item-card';
import { ColumnConfig, DataViewerComponent, DataViewerConfig } from '@worthyd/shared/ui/data-viewer';
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
    <!-- <lib-data-viewer [dataViewerConfig]="(dataViewerConfig$ | async)!">
      <ng-template #cardTemplate let-data="data">
        <lib-item-card [catalogItem]="data">
          <lib-cart-quantity ngProjectAs="lib-item-card-footer" (add)="addToCart(data.id, $event)"></lib-cart-quantity>
        </lib-item-card>
      </ng-template>

      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element">{{ element?.id }} 123123</td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let element">{{ element?.name }}</td>
      </ng-container>
    </lib-data-viewer> -->

    <lib-data-viewer
      [dataSource]="catalogItems$()"
      [displayedColumns]="['name', 'description', 'commands']"
      [columns]="columnConfig"
    >
      <ng-template #cardTemplate let-data="data">
        <lib-item-card [catalogItem]="data">
          <lib-cart-quantity ngProjectAs="lib-item-card-footer" (add)="addToCart(data.id, $event)"></lib-cart-quantity>
        </lib-item-card>
      </ng-template>
    </lib-data-viewer>
    <ng-template #symbolTemplate let-element>
      element
      <lib-cart-quantity (add)="addToCart(element.id, $event)"></lib-cart-quantity>
    </ng-template>
  `,
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  readonly cf = inject(CatalogFacade);
  readonly cart = inject(CartFacade);
  catalogItems$ = toSignal(this.cf.allCatalog$.pipe(startWith([])));

  cartItems$ = this.cart.allCart$;
  @ViewChild('symbolTemplate', { static: true }) symbolTemplate!: TemplateRef<{ $implicit: unknown }>;

  // TODO: Move away from function
  columnConfig: ColumnConfig<Item>[] = [];

  ngOnInit(): void {
    // Needs to be in ngOnInit to ensure symbolTemplate is available
    this.columnConfig = [
      {
        key: 'name',
        header: 'Name',
        cell: (element: Item) => element.name
      },
      {
        key: 'description',
        header: 'Description',
        cell: (element: Item) => element.description
      },
      {
        key: 'commands',
        header: 'Commands',
        cellTemplate: this.symbolTemplate
      }
    ];
  }

  // dataViewerConfig$: Observable<DataViewerConfig<Item>> = combineLatest([this.catalogItems$]).pipe(
  //   map(([catalogItems]) => ({
  //     data: catalogItems,
  //     // columns: ['id', 'name'] // Add all the columns you want to display
  //     columns: [] // Add all the columns you want to display
  //   }))
  // );

  addToCart(itemId: string, quantity: number) {
    this.cart.addItemToCart({ itemId, quantity: quantity });
  }
}
