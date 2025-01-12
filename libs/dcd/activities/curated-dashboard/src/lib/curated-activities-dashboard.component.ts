import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivitiesService } from '@dcd/activities/data-access';

@Component({
    selector: 'app-curated-activities-dashboard',
    templateUrl: './curated-activities-dashboard.component.html',
    styleUrls: ['./curated-activities-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CuratedActivitiesDashboardComponent {
  constructor(private activitiesService: ActivitiesService, private router: Router, private route: ActivatedRoute) {}
  curatedActivityGroups = this.activitiesService.getCuratedActivities();

  viewActivity(hash: number) {
    this.router.navigate([hash], { relativeTo: this.route });
  }
}
