import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GroupsV2GroupV2Card } from 'bungie-api-angular';
import { of } from 'rxjs';

import { ClanDatabase } from '@dcd/shared/clan-db';
import { addClan, removeClan, resetClan } from 'libs/dcd/shared/data-access/store/src/lib/clans/clans.actions';
import { MOCK_GROUP_DETAIL } from '../mock-objects/group-detail';

@Injectable()
export class ClanDetailMockService {
  constructor(
    private store: Store,
    private db: ClanDatabase
  ) {}

  getClan(clanId: string | number) {
    return of(MOCK_GROUP_DETAIL);
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
