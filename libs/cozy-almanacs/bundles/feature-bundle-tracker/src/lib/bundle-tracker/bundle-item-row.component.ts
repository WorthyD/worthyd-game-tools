import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResolvedBundleItem } from '@cozy-almanacs/state';
import { ItemLinksMenuComponent } from '@cozy-almanacs/ui/item-card';

/** One bundle item: a collected checkbox, its picture and name, its links, add to cart and turned in. */
@Component({
  selector: 'lib-bundle-item-row',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatTooltipModule, ItemLinksMenuComponent],
  template: `
    <div class="flex items-center gap-2 py-1" [class.collected]="item().collected">
      <mat-checkbox
        [checked]="item().collected"
        (change)="collectedChange.emit($event.checked)"
        [attr.aria-label]="'Collected ' + item().name"
        data-testid="collected"
      />
      @if (item().imageUrl) {
        <img [src]="item().imageUrl" alt="" class="item-sprite size-8 shrink-0" />
      } @else {
        <span class="size-8 shrink-0"></span>
      }
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <span class="item-name truncate" data-testid="item-name">{{ item().name }}</span>
          @if (item().quantity > 1) {
            <span class="item-muted text-sm">× {{ item().quantity }}</span>
          }
        </div>
        @if (item().description) {
          <p class="item-muted m-0 line-clamp-1 text-xs">{{ item().description }}</p>
        }
      </div>
      <lib-item-links-menu [item]="item()" />
      @if (item().itemId) {
        <button
          mat-icon-button
          type="button"
          [matTooltip]="'Add ' + item().quantity + ' to cart'"
          [attr.aria-label]="'Add ' + item().name + ' to cart'"
          (click)="addToCart.emit()"
          data-testid="add-to-cart"
        >
          <mat-icon>add_shopping_cart</mat-icon>
        </button>
      } @else {
        <span class="size-10 shrink-0"></span>
      }
      <button
        mat-icon-button
        type="button"
        [class.turned-in]="item().turnedIn"
        [attr.aria-pressed]="item().turnedIn"
        [matTooltip]="item().turnedIn ? 'Turned in' : 'Mark as turned in'"
        [attr.aria-label]="'Turned in ' + item().name"
        (click)="turnedInChange.emit(!item().turnedIn)"
        data-testid="turned-in"
      >
        <mat-icon>{{ item().turnedIn ? 'assignment_turned_in' : 'move_to_inbox' }}</mat-icon>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .item-sprite {
      image-rendering: pixelated;
      object-fit: contain;
    }
    .item-muted {
      color: var(--mat-sys-on-surface-variant);
    }
    .collected .item-name {
      text-decoration: line-through;
      color: var(--mat-sys-on-surface-variant);
    }
    .turned-in {
      color: var(--mat-sys-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleItemRowComponent {
  readonly item = input.required<ResolvedBundleItem>();
  readonly collectedChange = output<boolean>();
  readonly turnedInChange = output<boolean>();
  readonly addToCart = output<void>();
}
