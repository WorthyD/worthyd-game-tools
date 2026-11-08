import {
  Component,
  computed,
  inject,
  TemplateRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';
import { CartStore, CatalogStore } from '@crafting-cart/state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CartQuantityComponent } from '@crafting-cart/shared/ui/cart-quantity';
import { ItemCardComponent } from '@crafting-cart/shared/ui/item-card';
import { ColumnConfig, DataViewerComponent, DataViewerConfig } from '@worthyd/shared/ui/data-viewer';
import { Item } from '@crafting-cart/shared/models';
import { filterByLabels, labelOptions } from './catalog-filters';
import { LabelFilterComponent } from './label-filter.component';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    CartQuantityComponent,
    ItemCardComponent,
    DataViewerComponent,
    LabelFilterComponent
  ],
  template: `
    <lib-data-viewer
      [dataSource]="filteredItems()"
      [filterColumns]="['name', 'description']"
      [displayedColumns]="['image', 'name', 'description', 'commands']"
      [columns]="columnConfig"
    >
      <div dataViewerFilters class="flex flex-wrap items-center gap-3">
        @if (categories().length) {
          <lib-label-filter
            label="Categories"
            icon="category"
            [options]="categories()"
            [(selected)]="selectedCategories"
          />
        }
        @if (tags().length) {
          <lib-label-filter label="Tags" icon="sell" [options]="tags()" [(selected)]="selectedTags" />
        }
        @if (hasActiveFilters()) {
          <button mat-button type="button" (click)="clearFilters()">
            <mat-icon aria-hidden="true">filter_alt_off</mat-icon>
            Clear filters
          </button>
        }
      </div>
      <ng-template #cardTemplate let-data="data">
        <lib-item-card [catalogItem]="data">
          <lib-cart-quantity ngProjectAs="lib-item-card-footer" (add)="addToCart(data.id, $event)"></lib-cart-quantity>
        </lib-item-card>
      </ng-template>
    </lib-data-viewer>
    <ng-template #symbolTemplate let-element>
      <lib-cart-quantity (add)="addToCart(element.id, $event)"></lib-cart-quantity>
    </ng-template>
    <ng-template #imageTemplate let-element>
      <img [src]="element.imageUrl" alt="" class="catalog-item-image" />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }
    `
  ]
})
export class CatalogComponent implements OnInit {
  readonly catalog = inject(CatalogStore);
  readonly cart = inject(CartStore);
  catalogItems = this.catalog.entities;

  readonly categories = computed(() => labelOptions(this.catalog.categories(), this.catalogItems(), 'categories'));
  readonly tags = computed(() => labelOptions(this.catalog.tags(), this.catalogItems(), 'tags'));
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedTags = signal<string[]>([]);

  readonly filteredItems = computed(() =>
    filterByLabels(this.catalogItems(), this.selectedCategories(), this.selectedTags())
  );
  readonly hasActiveFilters = computed(() => this.selectedCategories().length > 0 || this.selectedTags().length > 0);

  @ViewChild('symbolTemplate', { static: true }) symbolTemplate!: TemplateRef<{ $implicit: unknown }>;
  @ViewChild('imageTemplate', { static: true }) imageTemplate!: TemplateRef<{ $implicit: unknown }>;

  // TODO: Move away from function
  columnConfig: ColumnConfig<Item>[] = [];

  ngOnInit(): void {
    // Needs to be in ngOnInit to ensure symbolTemplate is available
    this.columnConfig = [
      {
        key: 'name',
        header: 'Name',
        cell: (element: Item) => element.name
      },
      {
        key: 'description',
        header: 'Description',
        cell: (element: Item) => element.description
      },
      {
        key: 'image',
        header: 'Image',
        cellTemplate: this.imageTemplate
      },
      {
        key: 'commands',
        header: 'Commands',
        cellTemplate: this.symbolTemplate
      }
    ];
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedTags.set([]);
  }

  addToCart(itemId: string, quantity: number) {
    this.cart.addItemToCart({ itemId, quantity: quantity });
  }
}
