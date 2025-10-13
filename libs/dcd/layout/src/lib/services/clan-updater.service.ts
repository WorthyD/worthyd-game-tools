// @ts-nocheck
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError, toArray, switchMap, tap, take, filter } from 'rxjs/operators';
import { removeClan, selectEnabledClans, updateClan } from '@dcd/shared/data-access/store';
import { ClanMembersService } from '@dcd/shared/data-access/clan-collections';
import { from, of } from 'rxjs';
import { AppConfigService } from '@dcd/shared/utils/app-config';
import { ProfileUpdaterService } from '@dcd/shared/data-access/profile';
import { MemberActivityUpdaterService } from '@dcd/shared/data-access/member-activity';
import { MatDialog } from '@angular/material/dialog';
import { AppOfflineDialogComponent } from '@dcd/shared/ui/app-offline-dialog';
import { ClanDetailsService } from '@dcd/shared/data-access/clan-collections';

import deepEqual from 'deep-equal';
import { isMobile } from '@dcd/shared/utils';
import { BungieInfoUpdaterService } from '@dcd/shared/data-access/bungie-info';
import { ClanConfig } from '@dcd/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ClanUpdaterService {
  activeClanIds$ = this.store.select(selectEnabledClans);
  showLog = false; //environment.production === false;

  constructor(
    private store: Store,
    private memberService: ClanMembersService,
    private appConfig: AppConfigService,
    private clanDetailsService: ClanDetailsService,
    private profileUpdaterService: ProfileUpdaterService,
    private memberActivityUpdaterService: MemberActivityUpdaterService,
    private bungieInfoUpdaterService: BungieInfoUpdaterService,
    public dialog: MatDialog
  ) {
    this.showLog = this.appConfig.config.production === false;
  }
  clanUpdaterKey = 'clanUpdaterKey';
  clanMemberUpdater = 'clanMemberUpdater';
  profileUpdater = 'profileUpdater';
  recentActivityUpdater = 'recentActivityUpdater';
  updateAllClansBungieInfo = 'updateAllClansBungieInfo';

  update() {
    return this.activeClanIds$.pipe(
      take(1),
      tap((x) => this.showLog && this.tapFunc('Starting Updater', x, this.clanUpdaterKey)),
      switchMap((activeClans) => this.clanUpdate(activeClans)),
      tap(
        (x) => this.showLog && this.tapFunc('Starting Member Updater', x, this.clanMemberUpdater, this.clanUpdaterKey)
      ),
      switchMap((activeClans) => this.memberUpdate(activeClans)),
      tap(
        (x) => this.showLog && this.tapFunc('Member Update Complete', x, this.profileUpdater, this.clanMemberUpdater)
      ),
      switchMap((clans) => this.profileUpdaterService.profilesUpdate(clans)),
      tap(
        (x) =>
          this.showLog &&
          this.tapFunc('Member Profile Update Complete', x, this.recentActivityUpdater, this.profileUpdater)
      ),
      switchMap((clans) =>
        isMobile(window) ? of(clans) : this.memberActivityUpdaterService.membersActivityUpdate(clans)
      ),
      tap(
        (x) =>
          this.showLog &&
          this.tapFunc(
            'Member Recent Activity Update Complete',
            x,
            this.updateAllClansBungieInfo,
            this.recentActivityUpdater
          )
      ),
      switchMap((clans) =>
        isMobile(window) ? of(clans) : this.bungieInfoUpdaterService.updateAllClansBungieInfo(clans)
      ),
      tap(
        (x) => this.showLog && this.tapFunc('Bungie Info Update Complete', x, undefined, this.updateAllClansBungieInfo)
      )
    );
  }

  tapFunc(msg: any, data: any, logKey: any = undefined, lastLogKey: any = undefined) {
    console.log(msg, data);
    if (logKey) {
      console.time(logKey);
    }
    if (lastLogKey) {
      console.timeEnd(lastLogKey);
    }
  }

  clanUpdate(activeClans: any): any {
    return from(activeClans).pipe(
      // TODO: Double check concat map
      mergeMap((clanConfig: ClanConfig) => {
        return this.clanDetailsService.getClanDetailsSerialized(clanConfig.clanId, false).pipe(
          map((result: any) => {
            const newConfig = {
              ...clanConfig,
              clanName: result.name,
              clanTag: result.clanInfo.clanCallsign
            };

            // Only dispatch update on proper update
            if (!deepEqual(clanConfig, newConfig)) {
              this.store.dispatch(updateClan({ clan: newConfig }));
            }

            return newConfig;
          }),
          catchError((error: any) => {
            if (error.error.ErrorStatus === 'ClanNotFound') {
              this.store.dispatch(removeClan({ clanId: clanConfig.clanId }));
            }
            //throw Error(error);
            return of(undefined);
          })
        );
      }, 1),
      filter((x) => !!x),
      toArray(),
      catchError((err) => {
        if (err.message === 'System Offline') {
          const acknowledgeOffline = window.sessionStorage.getItem(
            this.appConfig.config.constants.D2DASHBOARD_ACKNOWLEDGE_OFFLINE
          );
          if (!acknowledgeOffline) {
            this.dialog.open(AppOfflineDialogComponent);
          }
        }
        throw err;
      })
    );
  }

  memberUpdate(activeClans: any): any {
    return from(activeClans).pipe(
      mergeMap((clanConfig: ClanConfig) => {
        return this.memberService.getClanMembersSerialized(clanConfig.clanId).pipe(
          map((members: any) => ({
            members,
            clanConfig
          }))
        );
      }, 1),
      toArray()
    );
  }
}
