import { Component, inject } from '@angular/core';
import { CartFacade, CartEntity, CatalogFacade } from '@crafting-cart/state';
import { Item } from '@crafting-cart/shared/models';

import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { ItemCardComponent } from '@crafting-cart/shared/ui/item-card';

import { PushPipe } from '@ngrx/component';
interface ShoppingListItem {
  item: Item;
  quantity: number;
}

@Component({
  selector: 'lib-shopping-list',
  imports: [CommonModule, PushPipe, ItemCardComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss'
})
export class ShoppingListComponent {
  readonly cf = inject(CatalogFacade);
  readonly cart = inject(CartFacade);
  cartItems$ = this.cart.allCart$;
  allItems$ = this.cf.allCatalog$;

  shoppingListItems$ = combineLatest([this.cartItems$, this.allItems$]).pipe(
    map(([items, catalogItems]) => this.getRawItems(items, catalogItems))
  );
  // rawItems$ =

  getRawItems(items: CartEntity[], catalogItems: Item[]): ShoppingListItem[] {
    const rawItems: ShoppingListItem[] = [];

    items.forEach((item) => {
      const catalogItem = catalogItems.find((x) => x.id === item.itemId);

      if (catalogItem) {
        const recipeItems = catalogItem?.ingredients.map((ingredient) => {
          const recipeItem = catalogItems.find((x) => x.id === ingredient.id);
          return { item: recipeItem, quantity: ingredient.quantity };
        });

        if (recipeItems && recipeItems.length > 0) {
          recipeItems.forEach((recipeItem) => {
            const recipeItemCount = item.quantity * recipeItem.quantity;

            if (recipeItem.item) {
              const existingItem = rawItems.find((x) => x.item.id === recipeItem.item?.id);

              if (existingItem) {
                const index = rawItems.findIndex((x) => x.item.id === recipeItem.item?.id);

                rawItems[index].quantity = existingItem.quantity + recipeItemCount;
              } else {
                rawItems.push({ item: recipeItem.item, quantity: recipeItemCount });
              }
            }
          });
        }
      }
    });

    return rawItems;
  }
}
