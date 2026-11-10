import { Component, computed, inject, ChangeDetectionStrategy, output } from '@angular/core';

import { CartStore, CatalogStore } from '@crafting-cart/state';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Cart drawer: a compact, scrollable list of cart lines with quantity steppers and cart-wide actions. */
@Component({
  selector: 'lib-cart-widget',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <header class="cart-divider flex shrink-0 items-center gap-2 border-b py-2 pr-2 pl-4">
      <div class="flex-1">
        <h2 class="cart-title m-0">Cart</h2>
        <p class="cart-muted m-0 text-sm" data-testid="cart-summary">{{ summary() }}</p>
      </div>
      <button mat-icon-button type="button" aria-label="Close cart" (click)="closed.emit()">
        <mat-icon aria-hidden="true">close</mat-icon>
      </button>
    </header>

    @let lines = viewModel();
    @if (lines.length) {
      <ul class="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">
        @for (line of lines; track line.itemId) {
          <li class="cart-divider flex items-center gap-3 border-b py-2 pr-2 pl-4" data-testid="cart-line">
            <img [src]="line.item?.imageUrl" alt="" class="pixelated size-10 shrink-0 object-contain" />
            <div class="min-w-0 flex-1">
              <div class="truncate font-medium" [title]="line.name">{{ line.name }}</div>
              <div class="flex items-center">
                <button
                  mat-icon-button
                  type="button"
                  class="cart-step"
                  [disabled]="line.quantity <= 1"
                  [attr.aria-label]="'Decrease ' + line.name"
                  (click)="setQuantity(line.itemId, line.quantity - 1)"
                >
                  <mat-icon aria-hidden="true">remove</mat-icon>
                </button>
                <input
                  type="number"
                  min="1"
                  class="cart-qty w-12 text-center"
                  [value]="line.quantity"
                  [attr.aria-label]="'Quantity of ' + line.name"
                  (change)="onQuantityInput(line.itemId, $event)"
                />
                <button
                  mat-icon-button
                  type="button"
                  class="cart-step"
                  [attr.aria-label]="'Increase ' + line.name"
                  (click)="setQuantity(line.itemId, line.quantity + 1)"
                >
                  <mat-icon aria-hidden="true">add</mat-icon>
                </button>
              </div>
            </div>
            <button
              mat-icon-button
              type="button"
              matTooltip="Remove"
              [attr.aria-label]="'Remove ' + line.name"
              (click)="deleteCartItem(line.itemId)"
            >
              <mat-icon aria-hidden="true">delete</mat-icon>
            </button>
          </li>
        }
      </ul>

      <footer class="cart-divider flex shrink-0 flex-col gap-2 border-t p-4">
        <a mat-flat-button routerLink="/list" (click)="closed.emit()">
          <mat-icon aria-hidden="true">checklist</mat-icon>
          View shopping list
        </a>
        <button mat-button type="button" (click)="emptyCart()">
          <mat-icon aria-hidden="true">remove_shopping_cart</mat-icon>
          Empty cart
        </button>
      </footer>
    } @else {
      <div class="cart-muted flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <mat-icon class="cart-empty-icon" aria-hidden="true">shopping_cart</mat-icon>
        <p class="m-0 font-medium">Your cart is empty</p>
        <p class="m-0 text-sm">Add items from the catalog to build a shopping list.</p>
      </div>
    }
  `,
  host: { class: 'flex h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .cart-title {
      font: var(--mat-sys-title-large);
    }
    .cart-muted {
      color: var(--mat-sys-on-surface-variant);
    }
    .cart-divider {
      border-color: var(--mat-sys-outline-variant);
    }
    .cart-qty {
      font: inherit;
      color: inherit;
      background: transparent;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: var(--mat-sys-corner-extra-small);
      padding: 2px 0;
      -moz-appearance: textfield;
    }
    .cart-qty::-webkit-inner-spin-button,
    .cart-qty::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .cart-qty:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: 1px;
    }
    .cart-empty-icon {
      width: 48px;
      height: 48px;
      font-size: 48px;
    }
    .pixelated {
      image-rendering: pixelated;
    }
  `
})
export class CartWidgetComponent {
  readonly cart = inject(CartStore);
  readonly catalog = inject(CatalogStore);

  /** Emitted when the user asks to close the drawer (close button or navigating to the list). */
  readonly closed = output<void>();

  readonly viewModel = computed(() => {
    const catalogItems = this.catalog.entityMap();
    return this.cart.entities().map((line) => {
      const item = catalogItems[line.itemId];
      return { ...line, item, name: item?.name ?? 'Unknown item' };
    });
  });

  readonly summary = computed(() => {
    const lines = this.viewModel();
    const units = lines.reduce((total, line) => total + line.quantity, 0);
    if (!lines.length) {
      return 'No items yet';
    }
    const itemLabel = lines.length === 1 ? 'item' : 'items';
    return units === lines.length ? `${lines.length} ${itemLabel}` : `${lines.length} ${itemLabel} · ${units} total`;
  });

  setQuantity(itemId: string, quantity: number) {
    if (quantity >= 1) {
      this.cart.updateItemsInCart({ itemId, quantity });
    }
  }

  onQuantityInput(itemId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const quantity = Math.floor(Number(input.value));
    if (Number.isFinite(quantity) && quantity >= 1) {
      this.setQuantity(itemId, quantity);
    } else {
      // Put the last valid value back rather than storing 0 or NaN.
      input.value = String(this.cart.entityMap()[itemId]?.quantity ?? 1);
    }
  }

  deleteCartItem(itemId: string) {
    this.cart.deleteItemFromCart({ itemId });
  }

  emptyCart() {
    this.cart.emptyCart();
  }
}
