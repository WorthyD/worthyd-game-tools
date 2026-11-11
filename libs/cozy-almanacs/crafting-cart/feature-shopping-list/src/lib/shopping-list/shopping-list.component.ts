import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CartStore, CartEntity, CatalogStore } from '@cozy-almanacs/state';
import { Item } from '@cozy-almanacs/models';

import { ItemCardComponent } from '@cozy-almanacs/ui/item-card';

import { MatCardModule } from '@angular/material/card';
interface ShoppingListItem {
  item: Item;
  quantity: number;
}

@Component({
  selector: 'lib-shopping-list',
  imports: [ItemCardComponent, MatCardModule],
  templateUrl: './shopping-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './shopping-list.component.scss'
})
export class ShoppingListComponent {
  readonly catalog = inject(CatalogStore);
  readonly cart = inject(CartStore);

  shoppingListItems = computed(() => this.getRawItems(this.cart.entities(), this.catalog.entities()));

  getRawItems(items: CartEntity[], catalogItems: Item[]): ShoppingListItem[] {
    const rawItems: ShoppingListItem[] = [];

    items.forEach((item) => {
      const catalogItem = catalogItems.find((x) => x.id === item.itemId);

      if (catalogItem) {
        const addOrUpdateItem = (itemToAdd: Item, quantityToAdd: number) => {
          const existingItem = rawItems.find((x) => x.item.id === itemToAdd.id);
          if (existingItem) {
            existingItem.quantity += quantityToAdd;
          } else {
            rawItems.push({ item: itemToAdd, quantity: quantityToAdd });
          }
        };

        const recipeItems = catalogItem.ingredients
          ?.map((ingredient) => {
            const recipeItem = catalogItems.find((x) => x.id === ingredient.id);
            return recipeItem ? { item: recipeItem, quantity: ingredient.quantity } : null;
          })
          // Remove null values
          .filter(Boolean) as ShoppingListItem[];

        if (recipeItems && recipeItems.length > 0) {
          recipeItems.forEach((recipeItem) => {
            addOrUpdateItem(recipeItem.item, item.quantity * recipeItem.quantity);
          });
        } else {
          // If no recipe items, add the catalog item directly
          addOrUpdateItem(catalogItem, item.quantity);
        }
      }
    });

    return rawItems;
  }
}
