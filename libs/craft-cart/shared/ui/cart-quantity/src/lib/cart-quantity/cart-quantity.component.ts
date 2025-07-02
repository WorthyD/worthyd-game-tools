import { Component, input, effect, output } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { pairwise } from 'rxjs';

@Component({
  selector: 'lib-cart-quantity',
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule],
  template: `
    <div class="flex">
      <button mat-button class="flex-none w-5" (click)="decrement()">-</button>
      <input id="quantity" class="flex-none w-10 text-center" type="number" [formControl]="quantity" matInput min="1" />
      <button mat-button class="flex-none w-5" (click)="increment()">+</button>
    </div>

    @if (showAdd()) {
      <button mat-button class="flex-1" (click)="addToCart()">Add to Cart</button>
    }

    @if (showDelete()) {
      <button mat-button class="flex-1" (click)="deleteItem.emit()">Delete</button>
    }
  `,
  host: { class: 'flex' },
  styleUrl: './cart-quantity.component.scss'
})
export class CartQuantityComponent {
  initialInput = input<string>('1');
  showAdd = input<boolean>(true);
  showDelete = input<boolean>(false);
  add = output<number>();
  deleteItem = output<void>();
  qtyChanged = output<number>();

  quantity = new FormControl('');

  constructor() {
    effect(() => {
      this.quantity.setValue(this.initialInput());
    });

    this.quantity.valueChanges.pipe(pairwise()).subscribe(([prev, val]) => {
      if (prev === val) {
        return; // No change, skip processing
      }
      const num = parseInt(val ?? '1');
      this.qtyChanged.emit(num);
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
    this.quantity.setValue((currentValue + 1).toString());
  }

  addToCart() {
    this.add.emit(parseInt(this.quantity.value ?? '1'));
  }
}
