import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartFacade, CatalogFacade } from '@crafting-cart/state';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { CartItemCardComponent } from '@crafting-cart/shared/ui/cart-item-card';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'lib-cart-widget',
  imports: [CommonModule, PushPipe, RouterLink, CartItemCardComponent],
  template: ` <h3>Cart</h3>
    <a routerLink="/list">Shopping List</a>

    @if (viewModel$ | ngrxPush; as cartItems) {
      @for (catalogItem of cartItems; track catalogItem.itemId) {
        <lib-cart-item-card
          [catalogItem]="catalogItem.item"
          [catalogItemQuantity]="catalogItem.quantity"
        ></lib-cart-item-card>
      }
    }`,
  styles: [``]
})
export class CartWidgetComponent {
  readonly cart = inject(CartFacade);
  readonly catalog = inject(CatalogFacade);

  readonly cartItems$ = this.cart.allCart$;

  readonly viewModel$ = this.cartItems$.pipe(
    switchMap((items) =>
      this.catalog.selectCatalogItemById$(items.map((item) => item.itemId)).pipe(
        map((catalogItems) =>
          items.map((item) => ({
            ...item,
            item: catalogItems.find((catalogItem) => catalogItem.id === item.itemId)
          }))
        )
      )
    )
  );
}
