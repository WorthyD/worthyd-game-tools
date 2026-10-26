import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SealsService } from '@dcd/seals/data-access';

@Component({
    selector: 'app-seals-dashboard',
    templateUrl: './seals-dashboard.component.html',
    styleUrls: ['./seals-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SealsDashboardComponent {
  constructor(private sealsService: SealsService) {}
  seals$ = this.sealsService.milestonesWithProfiles$;
}
