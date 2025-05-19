import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-cart-quantity',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  template: `
    <button mat-button>-</button>
    <input id="quantity" type="number" [formControl]="quantity" matInput />
    <button mat-button>+</button>
    <button mat-button>Add to Cart</button>
  `,
  styleUrl: './cart-quantity.component.scss'
})
export class CartQuantityComponent {
  quantity = new FormControl('');
}
