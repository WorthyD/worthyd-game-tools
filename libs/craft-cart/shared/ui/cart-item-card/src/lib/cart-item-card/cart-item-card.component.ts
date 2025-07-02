import { ChangeDetectionStrategy, Component, input } from '@angular/core';


import { Item } from '@crafting-cart/shared/models';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-cart-item-card',
  imports: [MatCardModule],
  template: `
    <mat-card class="example-card" appearance="outlined">
      <mat-card-header>
        <img mat-card-sm-image [src]="catalogItem()?.imageUrl" alt="" />
        <mat-card-title-group>
          <mat-card-title>{{ catalogItem()?.name }}</mat-card-title>
          <mat-card-subtitle>
            <ng-content select="lib-item-card-footer"></ng-content>
          </mat-card-subtitle>
        </mat-card-title-group>
      </mat-card-header>
    </mat-card>
  `,
  styleUrl: './cart-item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemCardComponent {
  catalogItem = input<Item>();
  catalogItemQuantity = input<number>();
}
