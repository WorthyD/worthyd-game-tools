import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';

import { CartStore, CatalogStore } from '@crafting-cart/state';
import { RouterLink } from '@angular/router';
import { CartItemCardComponent } from '@crafting-cart/shared/ui/cart-item-card';
import { CartQuantityComponent } from '@crafting-cart/shared/ui/cart-quantity';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-cart-widget',
  imports: [RouterLink, CartItemCardComponent, CartQuantityComponent, MatButtonModule],
  template: `
    <h3>Cart</h3>
    <a routerLink="/list">Shopping List</a>

    @let cartItems = viewModel();
    @for (catalogItem of cartItems; track catalogItem.itemId) {
      <lib-cart-item-card [catalogItem]="catalogItem.item" [catalogItemQuantity]="catalogItem.quantity">
        <lib-cart-quantity
          ngProjectAs="lib-item-card-footer"
          [initialInput]="catalogItem.quantity.toString()"
          [showAdd]="false"
          [showDelete]="true"
          (qtyChanged)="updateCartItemQuantity(catalogItem.itemId, $event)"
          (deleteItem)="deleteCartItem(catalogItem.itemId)"
        ></lib-cart-quantity>
      </lib-cart-item-card>
    }
    @if (cartItems.length === 0) {
      <p>No items in cart</p>
    } @else {
      <button mat-raised-button color="primary" (click)="emptyCart()">Empty Cart</button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [``]
})
export class CartWidgetComponent {
  readonly cart = inject(CartStore);
  readonly catalog = inject(CatalogStore);

  readonly viewModel = computed(() => {
    const catalogItems = this.catalog.entityMap();
    return this.cart.entities().map((item) => ({ ...item, item: catalogItems[item.itemId] }));
  });

  updateCartItemQuantity(itemId: string, quantity: number) {
    this.cart.updateItemsInCart({ itemId, quantity });
  }

  deleteCartItem(itemId: string) {
    this.cart.deleteItemFromCart({ itemId });
  }
  emptyCart() {
    this.cart.emptyCart();
  }
}
