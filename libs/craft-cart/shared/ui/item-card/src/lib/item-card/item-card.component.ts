import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { Item } from '@crafting-cart/shared/models';
@Component({
  selector: 'lib-item-card',
  imports: [MatCardModule],
  template: ` <mat-card>
    <mat-card-header>
      <mat-card-title>
        {{ catalogItem()?.name }}
      </mat-card-title>
    </mat-card-header>
    <img mat-card-image [src]="catalogItem()?.imageUrl" alt="" class="catalog-item-image" />
    <mat-card-actions>
      <ng-content select="lib-item-card-footer"></ng-content>
    </mat-card-actions>
  </mat-card>`,
  styleUrl: './item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  catalogItem = input<Item>();
}
