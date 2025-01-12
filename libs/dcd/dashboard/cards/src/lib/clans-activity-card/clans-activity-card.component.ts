import { Component } from '@angular/core';
import { ClansDetailsActivitiesService } from '@dcd/dashboard/data-access';

@Component({
    selector: 'app-clans-activity-card',
    templateUrl: './clans-activity-card.component.html',
    styleUrls: ['./clans-activity-card.component.scss'],
    standalone: false
})
export class ClansActivityCardComponent {
  constructor(private clansDetailsActivitiesService: ClansDetailsActivitiesService) {}
  events$ = this.clansDetailsActivitiesService.events$;
  loading$ = this.clansDetailsActivitiesService.playerActivitiesLoading$;
}
