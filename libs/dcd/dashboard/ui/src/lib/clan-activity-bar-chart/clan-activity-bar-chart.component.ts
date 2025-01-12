import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartModule } from '@dcd/shared/ui/bar-chart';
import { MatCardModule } from '@angular/material/card';
import { SkeletonChartLoaderComponent } from '@dcd/shared/ui/skeleton-chart-loader';

@Component({
    selector: 'dcd-clan-activity-bar-chart',
    imports: [CommonModule, BarChartModule, MatCardModule, SkeletonChartLoaderComponent],
    templateUrl: './clan-activity-bar-chart.component.html',
    styleUrls: ['./clan-activity-bar-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClanActivityBarChartComponent {
  @Input()
  events!: any;

  @Input()
  loading!: boolean;

  @Input()
  updating!: boolean;
}
