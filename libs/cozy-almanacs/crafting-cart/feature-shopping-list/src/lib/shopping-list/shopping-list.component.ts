import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CartStore, CartEntity, CatalogStore } from '@cozy-almanacs/state';
import { Item } from '@cozy-almanacs/models';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';

export interface ShoppingListItem {
  item: Item;
  quantity: number;
}

/** `cart` lists what's in the cart; `raw` lists the ingredients needed to craft it. */
export type ShoppingListView = 'cart' | 'raw';

/** Shape of the list's view and check-off state in local storage. */
export interface PersistedShoppingList {
  view: ShoppingListView;
  checked: Record<ShoppingListView, string[]>;
}

export const SHOPPING_LIST_STORAGE_KEY = 'shopping-list';

const isView = (value: unknown): value is ShoppingListView => value === 'cart' || value === 'raw';

@Component({
  selector: 'lib-shopping-list',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatIconModule],
  templateUrl: './shopping-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shopping-list.component.scss'
})
export class ShoppingListComponent {
  readonly catalog = inject(CatalogStore);
  readonly cart = inject(CartStore);
  private readonly localStorage = inject(LocalStorageService);

  private readonly saved = this.localStorage.getItem<PersistedShoppingList>(SHOPPING_LIST_STORAGE_KEY);

  readonly view = signal<ShoppingListView>(isView(this.saved?.view) ? this.saved.view : 'cart');
  readonly checked = signal<Record<ShoppingListView, ReadonlySet<string>>>({
    cart: new Set(this.saved?.checked?.cart ?? []),
    raw: new Set(this.saved?.checked?.raw ?? [])
  });

  readonly cartItems = computed(() => this.getCartItems(this.cart.entities(), this.catalog.entityMap()));
  readonly rawItems = computed(() => this.getRawItems(this.cart.entities(), this.catalog.entities()));

  /** Rows for the current view, each flagged with whether it's been checked off. */
  readonly rows = computed(() => {
    const items = this.view() === 'cart' ? this.cartItems() : this.rawItems();
    const checked = this.checked()[this.view()];
    return items.map((row) => ({ ...row, checked: checked.has(row.item.id) }));
  });

  readonly checkedCount = computed(() => this.rows().filter((row) => row.checked).length);

  readonly summary = computed(() => {
    const rows = this.rows();
    const done = this.checkedCount();
    if (rows.length && done === rows.length) {
      return 'All done!';
    }
    const noun = this.view() === 'cart' ? 'item' : 'resource';
    return `${done} of ${rows.length} ${noun}${rows.length === 1 ? '' : 's'} checked off`;
  });

  constructor() {
    effect(() => {
      const checked = this.checked();
      const persisted: PersistedShoppingList = {
        view: this.view(),
        checked: { cart: [...checked.cart], raw: [...checked.raw] }
      };
      this.localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, persisted);
    });
  }

  onViewChange(change: MatButtonToggleChange) {
    if (isView(change.value)) {
      this.view.set(change.value);
    }
  }

  toggleChecked(itemId: string, isChecked: boolean) {
    const view = this.view();
    this.checked.update((all) => {
      const next = new Set(all[view]);
      if (isChecked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return { ...all, [view]: next };
    });
  }

  clearChecked() {
    const view = this.view();
    this.checked.update((all) => ({ ...all, [view]: new Set<string>() }));
  }

  getCartItems(items: CartEntity[], catalogItems: Record<string, Item | undefined>): ShoppingListItem[] {
    return items
      .map((line) => ({ item: catalogItems[line.itemId], quantity: line.quantity }))
      .filter((line): line is ShoppingListItem => !!line.item);
  }

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
