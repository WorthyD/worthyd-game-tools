import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartWidgetComponent } from '@crafting-cart/shared/cart-widget';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartFacade } from '@crafting-cart/state';

import { PushPipe } from '@ngrx/component';
@Component({
  selector: 'lib-shell.component',
  imports: [
    CommonModule,
    RouterModule,
    CartWidgetComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    PushPipe
  ],
  template: `
    <div class="main-container">
      <mat-toolbar color="primary">
        Crafting Cart
        <a mat-button routerLink="/">Catalog</a>
        <a mat-button routerLink="/list">Shopping List</a>
        <span class="flex-auto"> </span>
        <button mat-icon-button (click)="cartDrawer.toggle()" [matBadge]="(cartCount$ | ngrxPush)">
          <mat-icon> shopping_cart </mat-icon>
        </button>
      </mat-toolbar>
      <mat-drawer-container class="lib-shell">
        <mat-drawer-content>
          <router-outlet></router-outlet>
        </mat-drawer-content>
        <mat-drawer mode="side" position="end" #cartDrawer>
          <lib-cart-widget></lib-cart-widget>
        </mat-drawer>
      </mat-drawer-container>
    </div>
  `,
  styles: `
    .main-container {
      display: flex;
      position: absolute;
      flex-direction: column;
      top: 0px;
      bottom: 0;
      left: 0;
      right: 0;
    }
    mat-drawer-container {
      //min-height: calc(100vh - 64px);
      flex: 1;
    }
    mat-sidenav-content {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  `
})
export class ShellComponentComponent {
  cartState = inject(CartFacade); // Inject the CartFacade to access cart-related methods and properties

  cartCount$ = this.cartState.cartCount$;
}
