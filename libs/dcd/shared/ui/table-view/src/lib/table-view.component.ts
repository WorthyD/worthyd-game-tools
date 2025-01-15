// Component originated from https://github.com/crafted/crafted

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { DisplayOptionsComponent } from '@dcd/shared/ui/display-options';

import { Viewer, Exporter, DataSource, Filterer, Grouper, Sorter } from '@dcd/shared/data';

import { RenderedViewModule } from '@dcd/shared/ui/rendered-view';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RenderedView, ViewLabel } from '@dcd/shared/data-models';

export interface Item {
  id: string;
  assignees: string[];
  body: string;
  title: string;
  comments: number;
  labels: string[];
  number: number;
  state: string;
  reporter: string;
  created: string;
  closed: string;
  updated: string;
  // reactions: Reactions;
  pr: boolean;
  url: string;
  //  statuses: ItemStatus[];
  dbAdded?: string;
  dbModified?: string;
}

interface TablePage {
  index: number;
  size: number;
}

@Component({
  selector: 'lib-table-view',
  templateUrl: './table-view.component.html',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RenderedViewModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
    DisplayOptionsComponent
  ],
  styleUrls: ['./table-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableViewComponent implements OnChanges {
  displayedColumns!: Observable<string[]>;

  views!: ViewLabel[];

  renderedHtml!: Observable<Map<Item, Map<string, Observable<RenderedView>>>>;

  @Input() header!: string;
  @Input() isLoading: boolean = false;

  @Input() filterer!: Filterer;

  @Input() viewer!: Viewer;

  @Input() grouper!: Grouper;

  @Input() sorter!: Sorter;

  @Input() dataSource!: DataSource;

  @Input() exporter!: Exporter;

  itemCount!: Observable<number>;
  loadingSize = new Array(25).fill('_').map((x) => x);

  page: BehaviorSubject<TablePage> = new BehaviorSubject({ size: 25, index: 0 });

  renderedData!: Observable<Item[]>;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] || changes['filterer'] || changes['sorter'] || changes['viewer'] || changes['loading']) {
      if (this.filterer && this.sorter && this.viewer) {
        if (this.isLoading === true) {
          this.showLoading();
        } else {
          this.loadData();
        }
      }
    }
  }

  private loadData() {
    if (this.dataSource && this.filterer && this.sorter && this.viewer) {
      const curatedData = this.dataSource.data.pipe(this.filterer.filter(), this.sorter.sort());
      this.renderedData = combineLatest([curatedData, this.page]).pipe(
        map(([data, page]) => data.slice(page.index * page.size, page.index * page.size + page.size))
      );
      this.itemCount = curatedData.pipe(map((d) => d.length));

      this.views = this.viewer.getViews();
      this.displayedColumns = this.viewer.state.pipe(
        map((state) => {
          return this.views.map((v) => v.id).filter((v) => state.views.indexOf(v) !== -1);
        })
      );

      this.renderedHtml = this.renderedData.pipe(
        map((items) => {
          const renderedHtml = new Map<Item, Map<string, Observable<RenderedView>>>();
          items.forEach((item) => {
            const itemRenderedViews = new Map<string, Observable<RenderedView>>();
            this.views.forEach((view) => itemRenderedViews.set(view.id, this.viewer.getRenderedView(item, view.id)));
            renderedHtml.set(item, itemRenderedViews);
          });
          return renderedHtml;
        }),
        shareReplay(1)
      );
    }
  }

  private showLoading() {
    this.views = this.viewer.getViews();
    this.displayedColumns = this.viewer.state.pipe(
      map((state) => {
        return this.views.map((v) => v.id).filter((v) => state.views.indexOf(v) !== -1);
      })
    );
  }

  setPage(event: PageEvent) {
    this.page.next({ index: event.pageIndex, size: event.pageSize });
  }
  export() {
    const curatedData = this.dataSource.data.pipe(this.filterer.filter(), this.sorter.sort());
    this.viewer.exportData(this.header?.toLowerCase()?.replace(' ', '_'), curatedData);
  }
}
