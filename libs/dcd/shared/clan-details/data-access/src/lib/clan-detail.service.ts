import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GroupsV2GroupV2, GroupsV2GroupV2Card, GroupV2Service } from 'bungie-api-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { ClanDatabase } from '@dcd/shared/clan-db';
import { addClan, removeClan, resetClan } from 'libs/dcd/shared/data-access/store/src/lib/clans/clans.actions';

@Injectable({
  //Note can't figure out how to provide in the module I want.
  providedIn: 'root'
})
export class ClanDetailService {
  constructor(
    private groupService: GroupV2Service,
    private httpClient: HttpClient,
    private store: Store,
    private db: ClanDatabase
  ) {}

  getClan(clanId: string | number) {
    return this.groupService.groupV2GetGroup(+clanId).pipe(
      map((clanResult) => {
        console.log('Fetched clan detail for id', clanResult?.Response?.detail);
        return clanResult?.Response?.detail;
      }),
      catchError((error) => {
        if (error.error.ErrorStatus === 'ClanNotFound') {
          return of({
            groupId: clanId,
            name: `Clan Not Found - ${clanId}`,
            clanInfo: { clanCallsign: '' }
          }) as Observable<GroupsV2GroupV2>;
        }

        throw Error(`Clan with id ${clanId} returned error`);
      })
    );
  }

  removeClan(clanId: string) {
    this.store.dispatch(removeClan({ clanId }));
    this.db.purgeDatabase(clanId);
  }

  resetClan(clan: GroupsV2GroupV2Card) {
    if (clan && clan.groupId) {
      this.db.purgeDatabase(clan.groupId.toString());
      this.store.dispatch(
        resetClan({
          clanId: clan.groupId.toString(),
          clanName: clan.name || '',
          clanTag: clan.clanInfo?.clanCallsign || ''
        })
      );
    }
  }

  addClan(clan: GroupsV2GroupV2Card) {
    if (clan && clan.groupId) {
      this.store.dispatch(
        addClan({
          clanId: clan.groupId.toString(),
          clanName: clan.name || '',
          clanTag: clan.clanInfo?.clanCallsign || ''
        })
      );
    }
  }
}
