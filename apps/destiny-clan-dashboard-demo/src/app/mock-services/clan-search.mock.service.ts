import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { selectAllClans, addClan } from '@dcd/shared/data-access/store';
import { GroupsV2GroupV2Card, GroupV2Service } from 'bungie-api-angular';
import { forkJoin, map, Observable, of, take } from 'rxjs';
import { ClanSearchResultItem } from '@dcd/clan-search/utils/clan-search-models';
import { Store } from '@ngrx/store';
import { MOCK_CLAN_INFO } from '../mock-objects/group-info';

@Injectable()
export class ClanSearchMockService {
  MOCK_CLAN: ClanSearchResultItem = {
    iconName: this.getIcon(-1),
    name: 'DEMO Clan',
    clanInfo: MOCK_CLAN_INFO,
    type: 'clan',
    id: '123456'
  };

  constructor(private store: Store) {}

  clans$ = this.store.select(selectAllClans);

  numericClanSearch(clanId: string | number) {
    return of([this.MOCK_CLAN]);
  }
  textClanSearch(currentQuery: string): Observable<ClanSearchResultItem[] | undefined> {
    return of([this.MOCK_CLAN]);
  }
  combinedSearch(currentQuery: string) {
    return of([this.MOCK_CLAN]);
  }
  textPlayerSearch(currentQuery: string): Observable<ClanSearchResultItem[]> {
    return of([this.MOCK_CLAN]);
  }

  findPlayerClan(selectedItem: any) {}

  addClan(clan: GroupsV2GroupV2Card | undefined) {
    if (clan) {
      this.store.dispatch(
        addClan({
          clanId: clan.groupId?.toString() || '',
          clanName: clan.name || '',
          clanTag: clan.clanInfo?.clanCallsign || ''
        })
      );
    }
  }

  getIcon(type: number) {
    switch (type) {
      case -1:
        return 'people';
      case 1:
        return 'xbox';
      case 2:
        return 'playstation';
      case 3:
        return 'steam';
      default:
        return 'sports_esports';
    }
  }
}
