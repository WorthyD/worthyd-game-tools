import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CartWidgetComponent } from '@crafting-cart/shared/cart-widget';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartStore } from '@crafting-cart/state';

/**
 * App frame: the header and footer fill the viewport edges and never scroll.
 * The routed page gets the space in between, capped at a readable width. Pages that manage their own scrolling (the
 * catalog) fill it exactly; any other page scrolls inside the drawer content.
 */
@Component({
  selector: 'lib-shell.component',
  imports: [
    RouterModule,
    CartWidgetComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <div class="flex h-dvh flex-col overflow-hidden">
      <mat-toolbar color="primary" class="shrink-0">
        Crafting Cart
        <a mat-button routerLink="/">Catalog</a>
        <a mat-button routerLink="/list">Shopping List</a>
        <span class="flex-auto"> </span>
        <button mat-icon-button (click)="cartDrawer.toggle()" [matBadge]="cartCount()" aria-label="Toggle cart">
          <mat-icon> shopping_cart </mat-icon>
        </button>
      </mat-toolbar>
      <mat-drawer-container class="min-h-0 flex-1">
        <mat-drawer-content>
          <div class="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4">
            <router-outlet></router-outlet>
          </div>
        </mat-drawer-content>
        <mat-drawer mode="side" position="end" class="cart-drawer w-80" #cartDrawer>
          <lib-cart-widget (closed)="cartDrawer.close()" />
        </mat-drawer>
      </mat-drawer-container>
      <footer class="app-footer flex shrink-0 items-center justify-between gap-4 px-4 py-2 text-sm">
        <span>Crafting Cart</span>
        <span>© {{ year }}</span>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    mat-drawer-content {
      display: flex;
      flex-direction: column;
    }
    .cart-drawer {
      border-left: 1px solid var(--mat-sys-outline-variant);
    }
    .app-footer {
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface-variant);
      border-top: 1px solid var(--mat-sys-outline-variant);
    }
  `
})
export class ShellComponentComponent {
  cartState = inject(CartStore);

  cartCount = this.cartState.cartCount;

  readonly year = new Date().getFullYear();
}
