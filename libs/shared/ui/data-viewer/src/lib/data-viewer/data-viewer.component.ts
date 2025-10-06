import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  input,
  Signal,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderedViewDynamicCompDirective } from './data-viewer.directive';
import { DataViewerConfig } from './data-viewer.config';
// import {} from '@cr
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataPage } from '../models/data-page.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatFormFieldModule, MatInputModule,
  ],
  template: `
    <h1>Data Viewer</h1>
    <mat-button-toggle-group [formControl]="currentView" aria-label="Font Style">
      <mat-button-toggle value="card">Card</mat-button-toggle>
      <mat-button-toggle value="table">Table</mat-button-toggle>
    </mat-button-toggle-group>
    <mat-form-field>
  <mat-label>Filter</mat-label>
  <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Mia" #input>
</mat-form-field>
    @switch (currentView.value) {
      @case ('card') {
        <div class="flex flex-wrap justify-around gap-4">
          <!-- Temp Card List -->
          @for (item of renderedData(); track trackByItem($index, item)) {
            <ng-container *ngTemplateOutlet="projectedTemplate; context: { data: item }"></ng-container>
          }
        </div>
      }
      @case ('table') {
        <table mat-table [dataSource]="dataSource()" matSort>
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let row">{{ row.id }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      }
    }
    <mat-paginator
      (page)="setPage($event)"
      [pageSizeOptions]="[1, 10, 25, 50, 100]"
      [pageSize]="pagerData().size"
      [length]="curatedData().length"
    >
    </mat-paginator>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewerComponent<T extends { id?: unknown }> implements AfterViewInit {
  @ViewChild(RenderedViewDynamicCompDirective, { static: true }) libDynamicComp!: RenderedViewDynamicCompDirective;
  @ContentChild('cardTemplate') projectedTemplate: TemplateRef<{ data: T }> = null!;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() {
    //this.dataSource = new MatTableDataSource<T>([]);
    //this.dataSource = new MatTableDataSource<T>(this.dataViewerConfig().data ?? []);
  }
  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }

  currentView = new FormControl('card');
  displayedColumns: string[] = ['id'];

  //currentView: 'card' | 'table' = 'card';

  dataViewerConfig = input.required<DataViewerConfig<T>>();

  pagerData: WritableSignal<DataPage> = signal({ index: 0, size: 2 });
  dataSource: Signal<MatTableDataSource<T>> = computed(() => new MatTableDataSource<T>(this.dataViewerConfig().data));

  filterValue = signal('');
  curatedData: Signal<T[]> = computed(() => {
    const filter = this.filterValue();
    return this.dataViewerConfig().data.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      );
    });
  });

  //TODO: include filters
  itemCount = computed(() => this.curatedData.length);

  renderedData: Signal<T[]> = computed(() => {
    const data = this.curatedData();
    const page = this.pagerData();
    const sorting = '';
    return data.slice(page.index * page.size, page.index * page.size + page.size);
  });

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.filterValue.set(filterValue.trim().toLowerCase());


    if (this.dataSource().paginator) {
      this.dataSource().paginator?.firstPage();
    }
  }

  setPage(event: PageEvent) {
    this.pagerData.set({ index: event.pageIndex, size: event.pageSize });
  }

  trackByItem(index: number, item: T): any {
    return item.id ?? index;
  }
}
