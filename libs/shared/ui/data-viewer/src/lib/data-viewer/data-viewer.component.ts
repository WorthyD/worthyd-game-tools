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
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderedViewDynamicCompDirective } from './data-viewer.directive';
import { DataViewerConfig } from './data-viewer.config';
// import {} from '@cr
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DataPage } from '../models/data-page.interface';
@Component({
  selector: 'lib-data-viewer',
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <h1>Data Viewer</h1>

    @switch (currentView) {
      @case ('card') {
        <div class="flex flex-wrap justify-around gap-4">
          <!-- Temp Card List -->
          @for (item of renderedData(); track trackByItem($index, item)) {
            <ng-container *ngTemplateOutlet="projectedTemplate; context: { data: item }"></ng-container>
          }
        </div>
      }
      @case ('table') {
        <p>Table View</p>
      }
    }
    <mat-paginator
      (page)="setPage($event)"
      [pageSizeOptions]="[10, 25, 50, 100]"
      [pageSize]="pagerData().size"
      [length]="curatedData().length"
    >
    </mat-paginator>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewerComponent<T extends { id?: unknown }> {
  @ViewChild(RenderedViewDynamicCompDirective, { static: true }) libDynamicComp!: RenderedViewDynamicCompDirective;
  @ContentChild('cardTemplate') projectedTemplate: TemplateRef<{ data: T }> = null!;

  constructor() {}

  currentView: 'card' | 'table' = 'card';

  dataViewerConfig = input.required<DataViewerConfig<T>>();

  pagerData: WritableSignal<DataPage> = signal({ index: 0, size: 25 });
  curatedData: Signal<T[]> = computed(() => this.dataViewerConfig().data);

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
