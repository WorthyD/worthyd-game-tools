import { Injectable } from '@angular/core';
//import { MemberProfile } from 'projects/data/src/lib/models';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ClanConfigMembers } from '@dcd/shared/models';
import { AggregateType } from '@dcd/shared/utils/stat-aggregators';
import { TrackedDuration } from '@dcd/shared/utils/serializers';

@Injectable({
  providedIn: 'root'
})
export class ProfileRecentActivityWorkerMockService {
  constructor() {}
  updateAllRecentActivityCache(clanId: string, clanMembers: any[], progress?: (done: any) => any): Observable<boolean> {
    // const activityCacheComplete: Subject<boolean> = new Subject();
    // const worker = new Worker(new URL('./profile-recent-activity-updater.worker', import.meta.url));

    // worker.onmessage = ({ data }) => {
    //   if (data.type === 'progress') {
    //     progress!(data.data);
    //   } else if (data.type === 'complete') {
    //     activityCacheComplete.next(true);
    //   }
    // };

    // worker.postMessage({
    //   clanId,
    //   clanMembers,
    //   apiKey: environment.apiKey
    // });
    // return activityCacheComplete;
    return of(true);
  }

  //getAllRecentActivitiesFromCache(clanId: string, memberProfiles: MemberProfile[]): Observable<any> {
  getAllRecentActivitiesFromCache(clanId: string, memberProfiles: any[]): Observable<any> {
    // const memberActivities = new Subject();
    // const worker = new Worker(new URL('./profile-recent-activity-getter.worker', import.meta.url));
    // worker.onmessage = ({ data }) => {
    //   memberActivities.next(data.data);
    // };

    // worker.postMessage({
    //   clanId,
    //   memberProfiles,
    //   apiKey: environment.apiKey
    // });
    // return memberActivities;
    return of([]);
  }
  getAllActivities(
    clansAndMembers: ClanConfigMembers[],
    statAggregatorType: AggregateType,
    activityModeId: number,
    activityTypeId: number
  ): Observable<any> {
    // const memberActivities = new Subject();
    // const worker = new Worker(new URL('./profile-activity-getter.worker', import.meta.url));
    // worker.onmessage = ({ data }) => {
    //   memberActivities.next(data.data);
    // };
    // //console.log('stat agg', statAggregator.getClanActivityStatsForDuration);

    // worker.postMessage({
    //   clansAndMembers,
    //   statAggregatorType,
    //   apiKey: environment.apiKey,
    //   activityModeId,
    //   activityTypeId
    // });
    // return memberActivities;
    return of([]);
  }

  getAllRecentClanActivitiesByActivityModeId(
    clansAndMembers: ClanConfigMembers[],
    trackedDates: TrackedDuration[],
    activityModeId: number,
    activityTypeId: number
  ): Observable<any> {
    // const memberActivities = new Subject();
    // const worker = new Worker(new URL('./clan-activity-recent-activity-getter.worker', import.meta.url));
    // worker.onmessage = ({ data }) => {
    //   memberActivities.next(data.data);
    // };

    // worker.postMessage({
    //   clansAndMembers,
    //   apiKey: environment.apiKey,
    //   trackedDates,
    //   activityModeId,
    //   activityTypeId
    // });
    //return memberActivities;
    return of([]);
  }
}
