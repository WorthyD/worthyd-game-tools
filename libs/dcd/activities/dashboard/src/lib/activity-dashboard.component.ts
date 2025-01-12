import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivitiesService } from '@dcd/activities/data-access';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-activity-dashboard',
    templateUrl: './activity-dashboard.component.html',
    styleUrls: ['./activity-dashboard.component.scss'],
    standalone: false
})
export class ActivityDashboardComponent {
  activitiesService = inject(ActivitiesService);
  route = inject(ActivatedRoute);

  curatedActivities = this.activitiesService.getCuratedActivities();

  activityHash$ = this.route.paramMap.pipe(map((params) => +params.get('activityHash')!));
  eventsLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  eventsLoading$: Observable<boolean> = this.eventsLoadingSource.asObservable();

  vm$ = this.activityHash$.pipe(
    map((hash) => {
      return {
        activity: this.activitiesService.getActivityById(hash),
        metrics: this.activitiesService.getCuratedMetrics(hash),
        collections: this.activitiesService.getCuratedCollections(hash),
        records: this.activitiesService.getCuratedRecords(hash)
      };
    })
  );
  events$ = this.activityHash$.pipe(
    tap(() => this.eventsLoadingSource.next(true)),
    switchMap((hash) => {
      return this.activitiesService.getActivityStatsByHash(hash);
    }),
    tap(() => this.eventsLoadingSource.next(false))
  );
}
