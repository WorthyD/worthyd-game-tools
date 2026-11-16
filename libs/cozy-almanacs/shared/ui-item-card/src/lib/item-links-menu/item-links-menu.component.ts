import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Item } from '@cozy-almanacs/models';

/**
 * A small icon button that opens a menu of an item's external links. Each link opens in a new tab.
 * Renders nothing when the item has no links.
 */
@Component({
  selector: 'lib-item-links-menu',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    @if (item().links.length) {
      <button
        mat-icon-button
        type="button"
        class="links-trigger"
        [matMenuTriggerFor]="linksMenu"
        [attr.aria-label]="'Links for ' + item().name"
        data-testid="item-links-trigger"
      >
        <mat-icon aria-hidden="true">link</mat-icon>
      </button>
      <mat-menu #linksMenu="matMenu" xPosition="before">
        @for (link of item().links; track link.url) {
          <a mat-menu-item [href]="link.url" target="_blank" rel="noopener noreferrer" data-testid="item-link">
            <span class="flex items-center gap-2">
              <span class="min-w-0 truncate">{{ link.text || link.url }}</span>
              <mat-icon class="link-external-icon" aria-hidden="true">open_in_new</mat-icon>
              <span class="cdk-visually-hidden">(opens in a new tab)</span>
            </span>
          </a>
        }
      </mat-menu>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .links-trigger {
      color: var(--mat-sys-on-surface-variant);
    }

    .link-external-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemLinksMenuComponent {
  readonly item = input.required<Pick<Item, 'name' | 'links'>>();
}
