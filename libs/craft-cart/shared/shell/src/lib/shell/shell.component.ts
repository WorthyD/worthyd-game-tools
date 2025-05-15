import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartWidgetComponent } from '@crafting-cart/shared/cart-widget';

@Component({
  selector: 'lib-shell.component',
  imports: [CommonModule, RouterModule, CartWidgetComponent],
  template: `
    <nav>
      <a routerLink="/">Catalog</a>
      <a routerLink="/list">Shopping List</a>
    </nav>
    <router-outlet></router-outlet>
    <lib-cart-widget></lib-cart-widget>
  `,
  styleUrl: './shell.component.scss'
})
export class ShellComponentComponent {}
