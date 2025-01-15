import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-skeleton-chart-loader',
  imports: [CommonModule],
  standalone: true,
  styleUrl: './skeleton-chart-loader.component.scss',
  template: `
    <div class="skeleton-chart-loader">
      <div
        class="skeleton-chart-loader__chart-item skeleton-item"
        *ngFor="let x of ['', '', '', '', '', '', '', '', '', '', '']"
      ></div>
    </div>
  `,
  //templateUrl: './skeleton-chart-loader.component.html',
  //styleUrls: ['./skeleton-chart-loader.component.scss']
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonChartLoaderComponent {}
