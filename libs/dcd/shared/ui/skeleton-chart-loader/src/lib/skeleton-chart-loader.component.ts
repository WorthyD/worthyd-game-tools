import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'lib-skeleton-chart-loader',
  imports: [],
  standalone: true,
  styleUrl: './skeleton-chart-loader.component.scss',
  template: `
    <div class="skeleton-chart-loader">
      @for (x of ['', '', '', '', '', '', '', '', '', '', '']; track x) {
        <div
          class="skeleton-chart-loader__chart-item skeleton-item"
        ></div>
      }
    </div>
    `,
  //templateUrl: './skeleton-chart-loader.component.html',
  //styleUrls: ['./skeleton-chart-loader.component.scss']
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonChartLoaderComponent {}
