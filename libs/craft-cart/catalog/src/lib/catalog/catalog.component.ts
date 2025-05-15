import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartFacade, CatalogFacade } from '@crafting-cart/state';
import { PushPipe } from '@ngrx/component';

@Component({
  selector: 'lib-catalog',
  imports: [CommonModule, PushPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  readonly cf = inject(CatalogFacade);
  readonly cart = inject(CartFacade);
  catalogItems$ = this.cf.allCatalog$;
  cartItems$ = this.cart.allCart$;

  addToCart(itemId: string) {
    this.cart.addItemToCart({itemId, quantity: 1});
  }
}
