import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartFacade, CatalogFacade } from '@crafting-cart/state';
import { PushPipe } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartQuantityComponent } from '@crafting-cart/shared/ui/cart-quantity';
import { ItemCardComponent } from '@crafting-cart/shared/ui/item-card';

@Component({
  selector: 'lib-catalog',
  imports: [CommonModule, PushPipe, MatButtonModule, MatCardModule, CartQuantityComponent, ItemCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  readonly cf = inject(CatalogFacade);
  readonly cart = inject(CartFacade);
  catalogItems$ = this.cf.allCatalog$;
  cartItems$ = this.cart.allCart$;

  addToCart(itemId: string, quantity: number) {
    this.cart.addItemToCart({ itemId, quantity: quantity });
  }
}
