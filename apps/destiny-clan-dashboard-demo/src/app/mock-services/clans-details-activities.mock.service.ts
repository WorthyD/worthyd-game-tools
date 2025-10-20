import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllClansWithMembersProfiles, selectAllRecentActivityUpdates } from '@dcd/shared/data-access/store';
import { clanActivitiesMock } from '../mock-objects/clan-activities';

@Injectable()
export class ClansDetailsActivitiesMockService {
  constructor(private store: Store) {}

  clanMembersProfiles$ = this.store.select(selectAllClansWithMembersProfiles);
  activityUpdates$ = this.store.select(selectAllRecentActivityUpdates);
  areActivitiesUpdating$ = false;
  playerActivitiesLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  playerActivitiesLoading$: Observable<boolean> = this.playerActivitiesLoadingSource.asObservable();

  events$ = of(clanActivitiesMock);
}
