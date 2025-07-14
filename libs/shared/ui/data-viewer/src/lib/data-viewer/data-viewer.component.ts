import { ChangeDetectionStrategy, Component, ContentChild, input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderedViewDynamicCompDirective } from './data-viewer.directive';
import { DataViewerConfig } from './data-viewer.config';
// import {} from '@cr

@Component({
  selector: 'lib-data-viewer',
  imports: [CommonModule],
  template: `
    <h1>Data Viewer</h1>
    <!-- RenderedViewDynamicCompDirective -->
    <!-- <ng-template libDynamicComp></ng-template> -->
    <div class="flex gap-4">
      <!-- Temp Card List -->
      <!-- <ng-container *ngFor="let item of dataViewerConfig().data; trackBy: trackByItem"> -->

      @for (item of dataViewerConfig().data; track item) {
        <ng-container *ngTemplateOutlet="projectedTemplate; context: { data: item }"></ng-container>
      }
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewerComponent<T> {
  @ViewChild(RenderedViewDynamicCompDirective, { static: true }) libDynamicComp!: RenderedViewDynamicCompDirective;
  @ContentChild('myTemplate') projectedTemplate: TemplateRef<{ data: T }> = null!;

  dataViewerConfig = input.required<DataViewerConfig<T>>();

  trackByItem(index: number, item: T): any {
    return item;
  }
}
