import { Injectable } from '@angular/core';
//import { MemberProfile, ClanMember } from 'bungie-models';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { MemberProfile } from '@dcd/shared/models';
import { SeasonService } from '@dcd/shared/data-access/definitions';

@Injectable()
export class ProfileWorkerMockService {
  constructor() {}

  loadProfiles(clanId: string, clanMembers: any[], progress?: (done: any) => any): Observable<MemberProfile[]> {

    // const members: BehaviorSubject<MemberProfile[]> = new BehaviorSubject<MemberProfile[]>([]);

    // const worker = new Worker(new URL('./profile.worker', import.meta.url));
    // worker.onmessage = ({ data }) => {
    //   if (data.type === 'progress') {
    //     progress!(data.data);
    //   } else if (data.type === 'complete') {
    //     members.next(data.data);
    //     //activityCacheComplete.next(true);
    //   }
    // };

    // worker.postMessage({
    //   clanId,
    //   clanMembers,
    //   progressionHashes: this.seasonService.getSeasonProgressionHashes(),
    //   apiKey: environment.apiKey
    // });





    return of([]);
  }
}
