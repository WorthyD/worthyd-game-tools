import { Signal, computed, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

export interface EditorRow<T> {
  /** Position in the draft list, which is what the store's row methods take. */
  index: number;
  row: T;
}

/** Filter, paging and selection for one of the editor's tables. Selection is kept by row index. */
export class EditorTable<T> {
  readonly filter = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(50);
  readonly selected = signal<ReadonlySet<number>>(new Set());

  readonly filtered: Signal<EditorRow<T>[]> = computed(() => {
    const query = this.filter().trim().toLowerCase();
    const rows = this.rows().map((row, index) => ({ index, row }));
    return query ? rows.filter(({ row }) => this.searchText(row).toLowerCase().includes(query)) : rows;
  });

  readonly page: Signal<EditorRow<T>[]> = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly allPageSelected = computed(
    () => this.page().length > 0 && this.page().every(({ index }) => this.selected().has(index))
  );

  readonly somePageSelected = computed(
    () => !this.allPageSelected() && this.page().some(({ index }) => this.selected().has(index))
  );

  constructor(
    private readonly rows: Signal<T[]>,
    private readonly searchText: (row: T) => string
  ) {}

  setFilter(value: string): void {
    this.filter.set(value);
    this.pageIndex.set(0);
  }

  changePage({ pageIndex, pageSize }: PageEvent): void {
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
  }

  /** Clears the filter and shows the page that holds `index` (e.g. a row that was just added). */
  reveal(index: number): void {
    this.filter.set('');
    this.pageIndex.set(Math.max(0, Math.floor(index / this.pageSize())));
  }

  toggle(index: number): void {
    this.selected.update((selected) => {
      const next = new Set(selected);
      if (!next.delete(index)) {
        next.add(index);
      }
      return next;
    });
  }

  togglePage(): void {
    const select = !this.allPageSelected();
    this.selected.update((selected) => {
      const next = new Set(selected);
      this.page().forEach(({ index }) => (select ? next.add(index) : next.delete(index)));
      return next;
    });
  }

  /** Selects every row that matches the filter, across pages. */
  selectFiltered(): void {
    this.selected.set(new Set(this.filtered().map(({ index }) => index)));
  }

  clearSelection(): void {
    this.selected.set(new Set());
  }
}
