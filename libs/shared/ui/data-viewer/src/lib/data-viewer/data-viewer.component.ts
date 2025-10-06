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
@Component({
  selector: 'lib-data-viewer',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule
  ],
  template: `
    <h1>Data Viewer</h1>
    <mat-button-toggle-group [formControl]="currentView" aria-label="Font Style">
      <mat-button-toggle value="card">Card</mat-button-toggle>
      <mat-button-toggle value="table">Table</mat-button-toggle>
    </mat-button-toggle-group>
    {{ currentView.value }}
    @switch (currentView.value) {
      @case ('card') {
        <div class="flex flex-wrap justify-around gap-4">
          <!-- Temp Card List -->
          @for (item of dataSource().filteredData; track trackByItem($index, item)) {
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

  pagerData: WritableSignal<DataPage> = signal({ index: 0, size: 25 });
  curatedData: Signal<T[]> = computed(() => this.dataViewerConfig().data);
  dataSource: Signal<MatTableDataSource<T>> = computed(() => new MatTableDataSource<T>(this.curatedData()));

  //TODO: include filters
  itemCount = computed(() => this.curatedData.length);

  renderedData: Signal<T[]> = computed(() => {
    const data = this.dataViewerConfig().data;
    const page = this.pagerData();
    console.log('data', data);
    return data.slice(page.index * page.size, page.index * page.size + page.size);
  });

  setPage(event: PageEvent) {
    this.pagerData.set({ index: event.pageIndex, size: event.pageSize });
  }

  trackByItem(index: number, item: T): any {
    return item.id ?? index;
  }
}
