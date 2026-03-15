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
    <lib-data-viewer
      [dataSource]="catalogItems$()"
      [filterColumns]="['name', 'description']"
      [displayedColumns]="['image', 'name', 'description', 'commands']"
      [columns]="columnConfig"
    >
      <ng-template #cardTemplate let-data="data">
        <lib-item-card [catalogItem]="data">
          <lib-cart-quantity ngProjectAs="lib-item-card-footer" (add)="addToCart(data.id, $event)"></lib-cart-quantity>
        </lib-item-card>
      </ng-template>
    </lib-data-viewer>
    <ng-template #symbolTemplate let-element>
      <lib-cart-quantity (add)="addToCart(element.id, $event)"></lib-cart-quantity>
    </ng-template>
    <ng-template #imageTemplate let-element>
      <img [src]="element.imageUrl" alt="" class="catalog-item-image" />
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
  @ViewChild('imageTemplate', { static: true }) imageTemplate!: TemplateRef<{ $implicit: unknown }>;

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
        key: 'image',
        header: 'Image',
        cellTemplate: this.imageTemplate
      },
      {
        key: 'commands',
        header: 'Commands',
        cellTemplate: this.symbolTemplate
      }
    ];
  }

  addToCart(itemId: string, quantity: number) {
    this.cart.addItemToCart({ itemId, quantity: quantity });
  }
}
