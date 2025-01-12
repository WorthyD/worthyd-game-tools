import { Component } from '@angular/core';
import { SealsService } from '@dcd/seals/data-access';

@Component({
    selector: 'app-seals-dashboard',
    templateUrl: './seals-dashboard.component.html',
    styleUrls: ['./seals-dashboard.component.scss'],
    standalone: false
})
export class SealsDashboardComponent {
  constructor(private sealsService: SealsService) {}
  seals$ = this.sealsService.milestonesWithProfiles$;
}
