import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  input,
  Signal,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnConfig } from './data-viewer.config';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataPage } from '../models/data-page.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'lib-data-viewer',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  // This is important - it tells Angular to preserve the projected content
  preserveWhitespaces: true,
  template: `
    <h1>Data Viewer</h1>
    <mat-button-toggle-group [formControl]="currentView" aria-label="Font Style">
      <mat-button-toggle value="card">Card</mat-button-toggle>
      <mat-button-toggle value="table">Table</mat-button-toggle>
    </mat-button-toggle-group>
    <mat-form-field>
      <mat-label>Filter</mat-label>
      <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Mia" #input />
    </mat-form-field>
    <mat-form-field>
      <mat-label>Sort</mat-label>
      <mat-select [formControl]="sortDirectionInput" (selectionChange)="onSortChange($event)">
        @for (column of displayedColumns(); track column) {
          <mat-option value="{{ column }}-DESC">{{ column }} - DESC </mat-option>
          <mat-option value="{{ column }}-ASC">{{ column }} - ASC</mat-option>
        }
      </mat-select>
    </mat-form-field>

    @if (currentView.value === 'card') {
      <div class="flex flex-wrap justify-around gap-4">
        @for (item of pagedData(); track trackByItem($index, item)) {
          <ng-container *ngTemplateOutlet="projectedTemplate; context: { data: item }"></ng-container>
        }
      </div>
    } @else {
      <h3>Table View</h3>
      <table mat-table [dataSource]="pagedData()!" class="mat-elevation-z8">
        <!-- Generate column definitions dynamically from config -->
        @for (column of columns(); track column.key) {
          <ng-container [matColumnDef]="column.key">
            <th mat-header-cell *matHeaderCellDef>{{ column.header }}</th>
            <td mat-cell *matCellDef="let element">
              @if (column.cellTemplate) {
                <ng-container *ngTemplateOutlet="column.cellTemplate; context: { $implicit: element }"></ng-container>
              } @else {
                {{ column.cell?.(element) }}
              }
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>
    }

    <mat-paginator
      (page)="setPage($event)"
      [pageSizeOptions]="[10, 25, 50, 100]"
      [pageSize]="pagerData().size"
      [length]="filteredData()?.length || 0"
    >
    </mat-paginator>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewerComponent<T extends { id?: unknown }> {
  @ContentChild('cardTemplate') projectedTemplate: TemplateRef<{ data: T }> = null!;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tableInitialized = signal(false);
  columnsRegistered = signal(false);

  displayedColumns = input<string[]>();
  columns = input.required<ColumnConfig<T>[]>();
  dataSource = input<T[]>();

  filterValue = signal('');
  sortDirection = signal<string>('');
  sortField = signal<string>('');

  pagerData: WritableSignal<DataPage> = signal({ index: 0, size: 25 });

  filteredData: Signal<T[] | undefined> = computed(() => {
    const filter = this.filterValue();

    return this.dataSource()?.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(filter.toLowerCase()));
    });
  });

  sortedData: Signal<T[] | undefined> = computed(() => {
    const data = this.filteredData();

    const sortField = this.sortField();
    const sortDirection = this.sortDirection();

    if (!sortField || !sortDirection) {
      return data;
    }
    const newData = [...(data || [])].sort((a, b) => {
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];

      if (aValue < bValue) {
        return sortDirection === 'ASC' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'ASC' ? 1 : -1;
      }
      return 0;
    });

    return newData;
  });

  pagedData: Signal<T[] | undefined> = computed(() => {
    const data = this.sortedData();
    const page = this.pagerData();
    return data?.slice(page.index * page.size, page.index * page.size + page.size);
  });

  constructor(private cdr: ChangeDetectorRef) {}

  currentView = new FormControl<string>('table');
  sortDirectionInput = new FormControl<string>('');
  onSortChange(event: any) {
    const sort = this.sortDirectionInput.value;
    const sortField = sort ? sort.split('-')[0] : '';
    const sortDirection = sort ? sort.split('-')[1] : '';

    this.sortDirection.set(sortDirection);
    this.sortField.set(sortField);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue.set(filterValue.trim().toLowerCase());

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  setPage(event: PageEvent) {
    this.pagerData.set({ index: event.pageIndex, size: event.pageSize });
  }

  trackByItem(index: number, item: T): any {
    return item.id ?? index;
  }
}
