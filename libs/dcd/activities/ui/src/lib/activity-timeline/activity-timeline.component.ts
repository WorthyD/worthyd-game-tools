import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartModule } from '@dcd/shared/ui/bar-chart';
import { MatCardModule } from '@angular/material/card';
import { SkeletonChartLoaderComponent } from '@dcd/shared/ui/skeleton-chart-loader';

@Component({
  selector: 'dcd-activity-timeline',
  imports: [CommonModule, BarChartModule, MatCardModule, SkeletonChartLoaderComponent],
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ActivityTimelineComponent {
  @Input()
  events!: any;

  @Input()
  loading!: boolean;
}
