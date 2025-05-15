import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartFacade } from '@crafting-cart/state';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';

@Component({
  selector: 'lib-cart-widget',
  imports: [CommonModule, PushPipe, RouterLink],
  template: ` <h3>Cart</h3>
    <a routerLink="/list">Shopping List</a>

    @if (cartItems$ | ngrxPush; as cartItems) {
      @for (catalogItem of cartItems; track catalogItem.itemId) {
        <div>{{ catalogItem.itemId }} - {{ catalogItem.quantity }}</div>
      }
    }`,
  styles: [``]
})
export class CartWidgetComponent {
  readonly cart = inject(CartFacade);
  cartItems$ = this.cart.allCart$;
}
