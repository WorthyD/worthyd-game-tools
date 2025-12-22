import { Injectable } from '@angular/core';
import { delay, from, map, mergeMap, Observable, of, switchMap, tap, toArray } from 'rxjs';

import { ClanMemberProfile } from '@dcd/shared/models';
import { ClanRosterItem } from '@dcd/clans-roster/models';
import { BungieInfo } from '@dcd/shared/models';
import { getMockGroupMember } from '../mock-objects/group-member';
import { getMockProfile } from '../mock-objects/profile';
import { GroupsV2GroupMember } from 'bungie-api-angular';
import { MOCK_BUNGIE_INFO } from '../mock-objects/bungie-info';

@Injectable({ providedIn: 'root' })
export class ClansRosterMockService {
  clanProfiles$: Observable<ClanMemberProfile[]> = of(
    Array(20)
      .fill(null)
      .map(() => ({
        clan: {
          clanId: '2073131',
          clanName: 'DoD Paternal Chums',
          clanTag: 'DoD'
        },
        member: getMockGroupMember() as unknown as GroupsV2GroupMember,
        profile: getMockProfile() as unknown as ClanMemberProfile
      }))
  ) as Observable<ClanMemberProfile[]>;

  clanProfilesLoading$: Observable<boolean> = of(false);

  clanRosterItems$: Observable<ClanRosterItem[]> = this.clanProfiles$.pipe(
    delay(500),
    map((clanProfiles) => {
      return clanProfiles.map(
        (cp) =>
          ({
            ...cp,
            bungieInfo: MOCK_BUNGIE_INFO
          }) as unknown as ClanRosterItem
      );
    }),
    tap((x) => console.log('clanProfiles in mock roster service', x))
  );

  //constructor(private bungieInfoService: BungieInfoMockService) {}
}
