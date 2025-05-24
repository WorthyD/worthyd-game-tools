import { Component, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-cart-quantity',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  template: `
    <div class="flex">
      <button mat-button class="flex-none w-5" (click)="decrement()">-</button>
      <input id="quantity" class="flex-none w-10 text-center" type="number" [formControl]="quantity" matInput min="1" />
      <button mat-button class="flex-none w-5" (click)="increment()">+</button>
    </div>
    <button mat-button class="flex-1" (click)="addToCart()">Add to Cart</button>
  `,
  host: { class: 'flex' },
  styleUrl: './cart-quantity.component.scss'
})
export class CartQuantityComponent {
  initialInput = input<string>('1');
  add = output<number>();

  quantity = new FormControl('');

  constructor() {
    effect(() => {
      this.quantity.setValue(this.initialInput());
    });
  }
  decrement() {
    const currentValue = parseInt(this.quantity.value ?? '0');
    if (currentValue > 1) {
      this.quantity.setValue((currentValue - 1).toString());
    }
  }

  increment() {
    const currentValue = parseInt(this.quantity.value ?? '0');
    console.log(currentValue);
    this.quantity.setValue((currentValue + 1).toString());
  }
  addToCart() {
    this.add.emit(parseInt(this.quantity.value ?? '1'));
  }
}
