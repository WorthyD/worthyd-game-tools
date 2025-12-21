import { Injectable } from '@angular/core';
import { from, map, mergeMap, Observable, switchMap, tap, toArray } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllClansMembersProfiles, selectClanMemberProfileStateLoading } from '@dcd/shared/data-access/store';

import { ClanMemberProfile } from '@dcd/shared/models';
import { ClanBungieInfoService } from '@dcd/shared/data-access/clan-collections';
import { ClanRosterItem } from '@dcd/clans-roster/models';
import { BungieInfo } from '@dcd/shared/models';

@Injectable({ providedIn: 'root' })
export class ClansRosterService {
  clanProfiles$: Observable<ClanMemberProfile[]> = this.store.select(selectAllClansMembersProfiles);
  clanProfilesLoading$: Observable<boolean> = this.store.select(selectClanMemberProfileStateLoading); //.pipe(

  clanRosterItems$: Observable<ClanRosterItem[]> = this.clanProfiles$.pipe(
    switchMap((clanProfiles) => {
      const clanIds = [...new Set(clanProfiles.map((cp) => cp.clan.clanId))];
      const clanGroups = clanIds.map((clanId) => {
        return { clanId: clanId, members: clanProfiles.filter((x) => x.clan.clanId === clanId) };
      });

      return from(clanGroups).pipe(
        mergeMap((clanGroups) => {
          return this.bungieInfoService
            .getSerializedBungieInfosFromCache(
              clanGroups.clanId,
              clanGroups.members.map((m) => m.member)
            )
            .pipe(
              switchMap((result) => {
                return result;
              })
            );
        }),
        toArray(),
        map((bungieInfo: BungieInfo[]) => {
          return clanProfiles.map((cp) => {
            return {
              ...cp,
              bungieInfo: bungieInfo.find(
                (bi) => bi?.membershipId === cp.member?.bungieNetUserInfo?.membershipId?.toString()
              )
            };
          });
        })
      );
    }),
    tap((x) => console.log('clanRosterItems$', x))
  );

  constructor(
    private store: Store,
    private bungieInfoService: ClanBungieInfoService
  ) {}
}
