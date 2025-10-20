import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllClansWithMembersProfiles, selectAllRecentActivityUpdates } from '@dcd/shared/data-access/store';
import { ProfileRecentActivityWorkerService } from './profile-recent-activity.fake.service';

@Injectable({
  providedIn: 'root'
})
export class ClansDetailsActivitiesService {
  constructor(
    private store: Store,
    private profileRecentActivityWorkerService: ProfileRecentActivityWorkerService
  ) {}

  clanMembersProfiles$ = this.store.select(selectAllClansWithMembersProfiles);
  activityUpdates$ = this.store.select(selectAllRecentActivityUpdates);
  areActivitiesUpdating$ = false;
  playerActivitiesLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  playerActivitiesLoading$: Observable<boolean> = this.playerActivitiesLoadingSource.asObservable();

  events$ = this.activityUpdates$.pipe(
    //distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    tap(() => this.playerActivitiesLoadingSource.next(true)),
    switchMap((y) => {
      // console.log('-----------------');
      return this.clanMembersProfiles$.pipe(
        //take(1),
        filter((x: any[]) => x.length > 0),
        switchMap((x) => {
          //console.log('------wark-----------', x);
          return this.profileRecentActivityWorkerService.getAllActivities(x, 'daily', 0, 0);
        })
      );
    }),
    tap((e) => console.log('Activities loaded for clan members', e)),
    tap(() => this.playerActivitiesLoadingSource.next(false))
  );
}
