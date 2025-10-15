import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  ContentChildren,
  effect,
  input,
  QueryList,
  Signal,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderedViewDynamicCompDirective } from './data-viewer.directive';
import { DataViewerConfig } from './data-viewer.config';
// import {} from '@cr
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatColumnDef, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    MatFormFieldModule,
    MatInputModule
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
    <!-- @switch (currentView.value) {
      @case ('card') {
        <div class="flex flex-wrap justify-around gap-4">
          @for (item of renderedData(); track trackByItem($index, item)) {
            <ng-container *ngTemplateOutlet="projectedTemplate; context: { data: item }"></ng-container>
          }
        </div>
      }
      @case ('table') { -->
        <table mat-table #table [dataSource]="dataSource()" matSort>
          <!-- Default ID column -->
          <!-- <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let row">id</td>
          </ng-container> -->

          <!-- Projected columns -->
          <!-- <ng-container *ngFor="let columnDef of columnDefs">
            <ng-container [matColumnDef]="columnDef.name">
               <ng-container *ngTemplateOutlet="columnDef.headerCell?.template"></ng-container>
              <ng-container *ngTemplateOutlet="columnDef.cell?.template"></ng-container>
            </ng-container>
          </ng-container> -->

            <ng-content select="ng-container[matColumnDef]"></ng-content>

          <!-- <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr> -->

          <!-- Project default columns -->

          <!-- <ng-content select="[matColumnDef]"></ng-content> -->

          <!-- Dynamic columns -->
          <!-- @for (col of dynamicColumns; track col) {
            <ng-container [matColumnDef]="col.field">
              <mat-header-cell *matHeaderCellDef>
                {{ col.header }}
              </mat-header-cell>
              <mat-cell *matCellDef="let row">
                <ng-container
                  *ngTemplateOutlet="col.template || defaultCell; context: { $implicit: row[col.field], row: row }"
                >
                </ng-container>
              </mat-cell>
            </ng-container>
          } -->

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
        </table>
        <!-- Default cell template -->
        <ng-template #defaultCell let-value>
          {{ value }}
        </ng-template>
      <!-- }
    } -->
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
export class DataViewerComponent<T extends { id?: unknown }>
  implements AfterViewInit, AfterContentInit, AfterViewChecked
{
  @ViewChild(RenderedViewDynamicCompDirective, { static: true }) libDynamicComp!: RenderedViewDynamicCompDirective;
  @ContentChild('cardTemplate') projectedTemplate: TemplateRef<{ data: T }> = null!;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChildren(MatColumnDef, { descendants: true }) columnDefs!: QueryList<MatColumnDef>;
  @ViewChild(MatTable) table!: MatTable<any>;

  tableInitialized = signal(false);
  columnsRegistered = signal(false);

  constructor(private cdr: ChangeDetectorRef) {
    //this.dataSource = new MatTableDataSource<T>([]);
    //this.dataSource = new MatTableDataSource<T>(this.dataViewerConfig().data ?? []);
    // this.currentView.valueChanges.subscribe((view) => {
    //   console.log('View changed to:', view);
    //   if (view === 'table') {
    //     console.log('Setting up table columns', this.table);
    //     this.columnDefs.forEach((columnDef) => {
    //       this.table.addColumnDef(columnDef);
    //     });
    //     // Then, set up the displayed columns
    //     this.setupDisplayedColumns();
    //     // Listen for changes in projected columns
    //     this.columnDefs.changes.subscribe(() => {
    //       this.setupDisplayedColumns();
    //     });
    //     // setTimeout(() => {
    //     //   this.table.renderRows();
    //     // }, 0);
    //   }
    // });
    // effect(() => {
    //   const isTableView = this.currentView.value === 'table';
    //   console.log('Table view status:', isTableView);
    //   if (isTableView) {
    //     this.tableInitialized.set(true);
    //   } else {
    //     this.tableInitialized.set(false);
    //     this.columnsRegistered.set(false);
    //   }
    // });
    // Effect for table initialization and column registration
    // effect(() => {
    //   console.log('Table initialized:', this.tableInitialized());
    //   console.log('Columns registered:', this.columnsRegistered());
    //   console.log('Table instance:', this.table);
    //   if (!this.table || !this.tableInitialized() || this.columnsRegistered()) {
    //     return;
    //   }
    //   // Register columns and trigger change detection
    //   try {
    //     console.log('Setting up table columns', this.table);
    //     this.columnDefs.forEach((columnDef) => {
    //       console.log('Registering column:', columnDef.name);
    //       if (!columnDef['_table']) {
    //         this.table.addColumnDef(columnDef);
    //       }
    //     });
    //     this.columnsRegistered.set(true);
    //   } catch (error) {
    //     console.warn('Failed to register columns:', error);
    //   }
    // });
  }

  ngOnInit() {
    // Initialization logic if needed
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;

    // Listen to view changes
  }

  ngAfterContentInit() {
    // Store the column names and listen for changes
    this.setupDisplayedColumns();
    // this.columnDefs.changes.subscribe(() => {
    //   this.setupDisplayedColumns();
    //   this.columnsRegistered.set(false); // Reset when columns change
    // });
  }

  ngAfterViewInit() {}

  ngAfterViewChecked() {
    // View checks are now handled by effects
  }

  private setupDisplayedColumns() {
    // Start with configured columns
    const configColumns = this.dataViewerConfig().columns || [];

    // Get all projected column names
    const projectedColumns = this.columnDefs.map((def) => {
      console.log('Column Def:', def);
      return def.name;
    });
    console.log('Projected columns:', projectedColumns);
    console.log('Projected columns:', this.columnDefs);

    // Use configured columns if provided, otherwise use projected columns
    this.displayedColumns = configColumns.length > 0 ? configColumns : projectedColumns;
    this.table.renderRows();
    // when using OnPush or in tricky timing cases, detect changes
    this.cdr.detectChanges();
    //this.displayedColumns = this.columnDefs;
  }

  currentView = new FormControl('table');
  displayedColumns: string[] = [];

  //currentView: 'card' | 'table' = 'card';

  dataViewerConfig = input.required<DataViewerConfig<T>>();

  pagerData: WritableSignal<DataPage> = signal({ index: 0, size: 2 });
  dataSource: Signal<MatTableDataSource<T>> = computed(() => new MatTableDataSource<T>(this.dataViewerConfig().data));

  filterValue = signal('');
  curatedData: Signal<T[]> = computed(() => {
    const filter = this.filterValue();
    return this.dataViewerConfig().data.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(filter.toLowerCase()));
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
