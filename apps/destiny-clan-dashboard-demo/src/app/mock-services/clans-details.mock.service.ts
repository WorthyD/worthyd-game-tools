// @ts-nocheck
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { from, Observable, of } from 'rxjs';
import { map, mergeMap, toArray, switchMap } from 'rxjs/operators';
import { ClanDetailsService as DataService } from '@dcd/shared/data-access/clan-collections';
import { ClanMemberProfile, ClanMemberProfileWSeason } from '@dcd/shared/models';
import { SeasonService } from '@dcd/shared/data-access/definitions';
import {
  selectAllClansMembersProfiles,
  selectClanMemberProfileStateLoading,
  selectEnabledClans
} from '@dcd/shared/data-access/store';
import { clanState } from '../mock-objects/clan-state';
import { MOCK_GROUP_DETAIL } from '../mock-objects/group-detail';
import { getMockGroupMember } from '../mock-objects/group-member';
import { getMockProfile } from '../mock-objects/profile';

@Injectable({
  providedIn: 'root'
})
export class ClansDetailsMockService {
  activeClans$ = of([clanState]);

  clanProfilesLoading$ = of(false);
  clanProfiles$ = this.store.select(selectAllClansMembersProfiles);

  highestPowerBonusMembers$: Observable<ClanMemberProfile[]> = of([]);
  highestSeasonPassMembers$: Observable<ClanMemberProfileWSeason[]> = of(
    Array(20)
      .fill(null)
      .map(() => ({
        clan: {
          clanId: '2073131',
          clanName: 'DoD Paternal Chums',
          clanTag: 'DoD'
        },
        member: getMockGroupMember(),
        profile: getMockProfile(),
        seasonPass: Math.floor(Math.random() * 100)
      }))
      .sort((a, b) => b.seasonPass - a.seasonPass)
  );

  lastLoginMembers$: Observable<ClanMemberProfile[]> = of(
    Array(20)
      .fill(null)
      .map(() => ({
        clan: {
          clanId: '2073131',
          clanName: 'DoD Paternal Chums',
          clanTag: 'DoD'
        },
        member: getMockGroupMember(),
        profile: getMockProfile(),
        seasonPass: Math.floor(Math.random() * 100)
      }))
      .sort((a, b) => new Date(b.profile.profile.data.dateLastPlayed) - new Date(a.profile.profile.data.dateLastPlayed))
  );
  inactiveMemberList$ = of(
    Array(20)
      .fill(null)
      .map(() => ({
        clan: {
          clanId: '2073131',
          clanName: 'DoD Paternal Chums',
          clanTag: 'DoD'
        },
        member: getMockGroupMember(),
        profile: getMockProfile(),
        seasonPass: Math.floor(Math.random() * 100)
      }))
      .sort((a, b) => new Date(a.profile.profile.data.dateLastPlayed) - new Date(b.profile.profile.data.dateLastPlayed))
  );

  getClan(clanId: string) {
    return of(MOCK_GROUP_DETAIL);
  }

  constructor(private store: Store) {}
}
