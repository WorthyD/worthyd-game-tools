import { ChangeDetectionStrategy, Component, ContentChild, input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderedViewDynamicCompDirective } from './data-viewer.directive';
import { DataViewerConfig } from './data-viewer.config';
// import {} from '@cr
import {MatPaginatorModule} from '@angular/material/paginator';
@Component({
  selector: 'lib-data-viewer',
  imports: [CommonModule],
  template: `
    <h1>Data Viewer</h1>

    @switch (dataViewerConfig().view) {
      @case ('card') {
        <div class="flex flex-wrap justify-around gap-4">
          <!-- Temp Card List -->
          @for (item of dataViewerConfig().data; track item) {
            <ng-container *ngTemplateOutlet="projectedTemplate; context: { data: item }"></ng-container>
          }
        </div>
      }
      @case ('table') {
        <p>Table View</p>
      }
    }
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewerComponent<T> {
  @ViewChild(RenderedViewDynamicCompDirective, { static: true }) libDynamicComp!: RenderedViewDynamicCompDirective;
  @ContentChild('cardTemplate') projectedTemplate: TemplateRef<{ data: T }> = null!;

  dataViewerConfig = input.required<DataViewerConfig<T>>();

  trackByItem(index: number, item: T): any {
    return item;
  }
}
