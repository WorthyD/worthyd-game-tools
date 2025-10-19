import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { selectAllClans, addClan } from '@dcd/shared/data-access/store';
import { Store } from '@ngrx/store';
import { GroupsV2GroupV2Card, GroupV2Service } from 'bungie-api-angular';
import { forkJoin, map, Observable, of, take } from 'rxjs';
import { ClanSearchResultItem } from '@dcd/clan-search/utils/clan-search-models';

@Injectable({ providedIn: 'root' })
export class ClanSearchService {
  constructor(
    private groupService: GroupV2Service,
    private httpClient: HttpClient,
    private store: Store,
    public dialog: MatDialog
  ) {}

  clans$ = this.store.select(selectAllClans);

  numericClanSearch(clanId: string | number) {
    return this.groupService.groupV2GetGroup(clanId as number).pipe(
      map((clanResult) => {
        const c = clanResult?.Response?.detail;
        return [
          {
            iconName: this.getIcon(-1),
            type: 'clan',
            name: c?.name,
            id: c?.groupId?.toString(),
            clanInfo: c
          }
        ];
      })
    );
  }
  textClanSearch(currentQuery: string): Observable<ClanSearchResultItem[] | undefined> {
    return this.groupService
      .groupV2GroupSearch({
        name: currentQuery,
        groupType: 1,
        groupMemberCountFilter: undefined,
        tagText: undefined,
        localeFilter: undefined
      })
      .pipe(
        map((clanListResults) => {
          const clanList = clanListResults?.Response?.results;

          return (
            clanList?.slice(0, 10).map((c) => {
              return {
                iconName: this.getIcon(-1) || '',
                type: 'clan',
                name: c.name || '',
                id: c.groupId?.toString(),
                clanInfo: c
              };
            }) || []
          );
        })
      );
  }
  combinedSearch(currentQuery: string) {
    const clanSearch = this.textClanSearch(currentQuery);
    const playerSearch = this.textPlayerSearch(currentQuery);

    return forkJoin([clanSearch, playerSearch]).pipe(
      map(([clanSearchResults, playerSearchResults]) => {
        return [...(clanSearchResults || []), ...playerSearchResults];
      })
    );
  }
  textPlayerSearch(currentQuery: string): Observable<ClanSearchResultItem[]> {
    const url = `https://www.bungie.net/Platform/User/Search/Prefix/${currentQuery}/0`;
    return this.httpClient.get(url).pipe(
      map((searchResults: any) => {
        return searchResults.Response.searchResults.slice(0, 10).map((profile: any) => {
          const displayName = `${profile.bungieGlobalDisplayName}#${profile.bungieGlobalDisplayNameCode}`;
          const memberships = profile.destinyMemberships;
          const crossSaveOverride = memberships.find((x: any) => x.crossSaveOverride !== 0);
          let membership;
          if (crossSaveOverride) {
            membership = memberships.find((x: any) => x.membershipType === crossSaveOverride.crossSaveOverride);
          } else {
            membership = memberships[0];
          }

          return {
            iconName: this.getIcon(membership.membershipType),
            name: displayName,
            memberInfo: membership,
            type: 'player'
          };
        });
      })
    );
  }

  findPlayerClan(selectedItem: any) {
    return this.groupService
      .groupV2GetGroupsForMember(0, 1, selectedItem.membershipId, selectedItem.membershipType)
      .pipe(take(1))
      .subscribe(({ Response }) => {
        if (Response && Response.totalResults && Response.totalResults > 0 && Response.results) {
          this.addClan(Response?.results[0]?.group || undefined);
        } else {
          // this.dialog.open(SearchErrorDialogComponent, { data: 'No clan found for the user.' });
        }
      });
  }

  addClan(clan: GroupsV2GroupV2Card | undefined) {
    console.log('Adding clan', clan);
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
