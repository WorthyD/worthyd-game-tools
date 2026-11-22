import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BundleStore, CartStore, ResolvedBundle, ResolvedBundleItem } from '@cozy-almanacs/state';
import { ItemLinksMenuComponent } from '@cozy-almanacs/ui/item-card';
import { BundleItemRowComponent } from './bundle-item-row.component';

interface BundleView extends ResolvedBundle {
  bundles: BundleView[];
  visibleItems: ResolvedBundleItem[];
  percent: number;
}

/**
 * The bundles section: pick a top-level bundle on the left, then check off its items (and the items of the
 * bundles inside it) as you collect and turn them in. Catalog items can be added to the cart.
 */
@Component({
  selector: 'lib-bundle-tracker',
  imports: [
    NgTemplateOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    ItemLinksMenuComponent,
    BundleItemRowComponent
  ],
  templateUrl: './bundle-tracker.component.html',
  styleUrl: './bundle-tracker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleTrackerComponent {
  protected readonly store = inject(BundleStore);
  private readonly cart = inject(CartStore);

  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  /** The `:bundleId` route param. Without one, the first bundle is shown. */
  protected readonly bundleId = computed(() => this.params()?.get('bundleId') ?? '');

  protected readonly hideCollected = signal(false);

  /** Top-level bundles with their progress, for the side list. */
  protected readonly bundles = computed(() => this.store.resolved().map((bundle) => this.toView(bundle)));
  protected readonly selected = computed<BundleView | undefined>(() => {
    const id = this.bundleId();
    const bundle = (id ? this.store.resolvedMap().get(id) : undefined) ?? this.store.resolved()[0];
    return bundle ? this.toView(bundle) : undefined;
  });
  protected readonly notFound = computed(() => !!this.bundleId() && !this.store.resolvedMap().has(this.bundleId()));

  /** Adds what the template shows: the items left after "Hide collected", and the percent done. */
  private toView(bundle: ResolvedBundle): BundleView {
    return {
      ...bundle,
      bundles: bundle.bundles.map((child) => this.toView(child)),
      visibleItems: this.hideCollected() ? bundle.items.filter((item) => !item.collected) : bundle.items,
      percent: bundle.totalRequired ? Math.round((bundle.totalCollected / bundle.totalRequired) * 100) : 0
    };
  }

  protected setCollected(item: ResolvedBundleItem, collected: boolean): void {
    this.store.setCollected(item.progressKey, collected);
  }

  protected setTurnedIn(item: ResolvedBundleItem, turnedIn: boolean): void {
    this.store.setTurnedIn(item.progressKey, turnedIn);
  }

  protected addToCart(item: ResolvedBundleItem): void {
    if (item.itemId) {
      this.cart.addItemToCart({ itemId: item.itemId, quantity: item.quantity });
    }
  }

  protected reset(bundle: ResolvedBundle): void {
    if (confirm(`Clear your progress for ${bundle.name}?`)) {
      this.store.resetBundle(bundle.id);
    }
  }
}
