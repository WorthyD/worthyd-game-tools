import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Item } from '@crafting-cart/shared/models';

@Component({
  selector: 'lib-item-card',
  imports: [MatCardModule],
  template: `
    <mat-card appearance="outlined" class="h-full">
      <div class="flex flex-1 gap-4 p-3">
        <img [src]="catalogItem().imageUrl" [alt]="catalogItem().name" class="item-sprite size-12 shrink-0" />
        <div class="flex min-w-0 flex-1 flex-col">
          <h3 class="mat-title-medium m-0 truncate">{{ catalogItem().name }}</h3>
          @if (catalogItem().description) {
            <p class="mat-body-small m-0 line-clamp-2 text-(--mat-sys-on-surface-variant)">
              {{ catalogItem().description }}
            </p>
          }
          <div class="mt-auto flex justify-end pt-2">
            <ng-content select="lib-item-card-footer" />
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styleUrl: './item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  readonly catalogItem = input.required<Item>();
}
