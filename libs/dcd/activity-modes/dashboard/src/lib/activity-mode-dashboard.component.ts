import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { ActivityModeService } from '../data-access/activity-mode.service';
import { ActivityModeService } from '@dcd/activity-modes/data-access';

@Component({
    selector: 'app-activity-mode-dashboard',
    templateUrl: './activity-mode-dashboard.component.html',
    styleUrls: ['./activity-mode-dashboard.component.scss'],
    standalone: false
})
export class ActivityModeDashboardComponent {
  constructor(
    private activityModeService: ActivityModeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  activities$ = this.activityModeService.getGroupedActivityModes();
  viewActivity(hash: number) {
    this.router.navigate([hash], { relativeTo: this.route });
  }
}
