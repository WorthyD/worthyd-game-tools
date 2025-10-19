// @ts-nocheck
// TODO: Update
import { Injectable, Injector, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError, toArray, switchMap, tap, take, filter } from 'rxjs/operators';
import { updateClanProfileSync } from '@dcd/shared/data-access/store';

import { from, Observable, of } from 'rxjs';
import { ProfileWorkerService } from './profile-worker.fake.service';
import { nowPlusMinutes } from '@dcd/shared/utils';
import { AppConfigService } from '@dcd/shared/utils/app-config';
import { ClanProfileService } from '@dcd/shared/data-access/clan-collections';
import { ClanDatabase } from '@dcd/shared/clan-db';
import { SeasonService } from '@dcd/shared/data-access/definitions';
import { addNotification, removeNotification, updateNotification } from '@dcd/shared/data-access/store';
import { ClanConfigMembers } from '@dcd/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdaterService {
  profileService: ClanProfileService;
  constructor(
    private store: Store,
    private profileWorkerService: ProfileWorkerService,
    private seasonService: SeasonService,
    private appConfig: AppConfigService
  ) {
    const clanDB = new ClanDatabase();
    this.profileService = new ClanProfileService(clanDB, appConfig.config.apiKey);
  }

  profilesUpdate(clans: ClanConfigMembers[]): Observable<ClanConfigMembers[]> {
    return from(clans).pipe(
      // TODO Verify Merge Map is appropriate for this.
      mergeMap((x) => {
        return this.profileUpdate(x).pipe(map((cm) => cm));
      }, 1),
      toArray()
    );
  }

  profileUpdate(clan: ClanConfigMembers): Observable<ClanConfigMembers> {
    const lastUpdate = new Date(clan.clanConfig.profileUpdate || '1/1/1900');
    const staleDate = nowPlusMinutes(-this.appConfig.config.constants.PROFILE_UPDATING_EXP_MINUTES);

    if (staleDate > lastUpdate) {
      this.store.dispatch(
        addNotification({
          notification: {
            id: 'memberProfile',
            title: `Updating ${clan.clanConfig.clanName} Profiles`,
            data: { progress: 0, complete: 0, total: clan.members.length }
          }
        })
      );
      const progress = (progressCount) => {
        this.store.dispatch(
          updateNotification({
            notification: {
              id: 'memberProfile',
              title: `Updating ${clan.clanConfig.clanName} Profiles`,
              data: {
                progress: progressCount / clan.members.length,
                complete: progressCount,
                total: clan.members.length
              }
            }
          })
        );
      };
      return this.profileWorkerService.loadProfiles(clan.clanConfig.clanId, clan.members, progress).pipe(
        filter((x) => x.length > 0),
        take(1),
        map((x) => {
          // eslint-disable-next-line @ngrx/avoid-dispatching-multiple-actions-sequentially
          this.store.dispatch(
            removeNotification({
              notification: {
                id: 'memberProfile',
                title: `Updating ${clan.clanConfig.clanName} Profiles`,
                data: { progress: clan.members.length, complete: clan.members.length, total: clan.members.length }
              }
            })
          );

          // eslint-disable-next-line @ngrx/avoid-dispatching-multiple-actions-sequentially
          this.store.dispatch(updateClanProfileSync({ clanId: clan.clanConfig.clanId }));

          //
          // console.log('------------- dispatch update ------------------');
          // this.clanMemberService.forceReload();
          return {
            ...clan,
            profiles: x
          };
        })
      );
    }

    return this.profileService
      .getSerializedProfilesFromCache(
        clan.clanConfig.clanId,
        clan.members,
        this.seasonService.getSeasonProgressionHashes(),
        [],
        [],
        []
      )
      .pipe(
        map((x) => {
          return { ...clan, profiles: x };
        })
      );
  }
}
