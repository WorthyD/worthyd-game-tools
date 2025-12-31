import { Injectable } from '@angular/core';
// import { RecordDefin itionService } from '@core/definition-services/record-definition.service';
import { SeasonService, DefinitionService } from '@dcd/shared/data-access/definitions';
import { ClanMemberProfile, MemberProfile } from '@dcd/shared/models';
import { getClanMemberId, getMemberProfileId } from '@dcd/shared/utils';
import { ClanProfileService } from '@dcd/shared/data-access/clan-collections';
// import { profileSerializer } from 'libs/data/src/lib/profile/profile.serializer';
import { delay, from, map, mergeMap, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { GlobalSealsService } from '@dcd/shared/data-access/seals';

import { SealClanMember, SealListItem } from '@dcd/seals/models';
import { Store } from '@ngrx/store';
import { selectAllClansWithMembers } from '@dcd/shared/data-access/store';
import { profileSerializer } from '@dcd/shared/data-access/profile';
import { PlayerMockService } from './player-details.mock.service';
import { getMockGroupMember } from '../mock-objects/group-member';
import { getMockProfile } from '../mock-objects/profile';
import { GroupsV2GroupMember } from 'bungie-api-angular';

@Injectable({
  providedIn: 'root'
})
export class SealsMockService {
  constructor(
    private store: Store,
    private definitionService: DefinitionService,
    // private recordNodeService: RecordDefinitionService,
    // private seasonService: SeasonService,
    // //private clansMembersService: ClansMembersService,
    // private profileService: ClanProfileService,
    private globalSeals: GlobalSealsService,
    private playerService: PlayerMockService
  ) {}

  clanMembers$ = this.store.select(selectAllClansWithMembers);

  sealNodes = this.globalSeals.sealNodes;

  clanProfiles$ = of(
    Array(20)
      .fill(null)
      .map(() => ({
        clan: {
          clanId: '2073131',
          clanName: 'DoD Paternal Chums',
          clanTag: 'DoD'
        },
        clanMember: getMockGroupMember() as unknown as GroupsV2GroupMember,
        profile: getMockProfile() as unknown as MemberProfile
      }))
  );

  milestonesWithProfiles$: Observable<SealListItem[]> = this.clanProfiles$.pipe(
    map((cp) => {
      return this.globalSeals.sealNodes
        .filter((x) => x.redacted === false)
        .map((seal) => {
          const sealRecord = this.definitionService.recordDefinition[seal.completionRecordHash as number];
          const sealGildingRecord =
            sealRecord && sealRecord.titleInfo && sealRecord.titleInfo.gildingTrackingRecordHash
              ? sealRecord.titleInfo.gildingTrackingRecordHash
              : 0;

          return {
            seal: seal,
            totalMembers: cp.length,
            completedCount: this.getCompletionCount(cp, seal.completionRecordHash),
            gildedCount: this.getCompletionCount(cp, sealGildingRecord),
            isGilded: sealGildingRecord > 0
          };
        });
    })
  );

  getSealDetails$(sealHash: any): Observable<SealClanMember[]> {
    const sealCompletionHash = this.globalSeals.sealNodes.find((h) => h.hash == sealHash)?.completionRecordHash;
    const sealRecord = this.definitionService.recordDefinition[sealCompletionHash as number];
    const sealGildingRecord =
      sealRecord && sealRecord.titleInfo && sealRecord.titleInfo.gildingTrackingRecordHash
        ? sealRecord.titleInfo.gildingTrackingRecordHash
        : 0;

    return this.clanProfiles$
      .pipe(
        delay(500),
        map((clanProfiles) => {
          return clanProfiles.map((clanProfile) => {
            const profileProgression =
              clanProfile.profile.profileRecords.data.records[sealCompletionHash!]?.objectives[0];
            const gildedProgression =
              sealGildingRecord > 0 ? clanProfile.profile.profileRecords.data.records[sealGildingRecord] : undefined;

            return {
              clanMember: clanProfile.clanMember,
              profile: profileSerializer(clanProfile.profile, [], [], [], []), // Strip records to minimize size of object
              clan: clanProfile.clan,
              sealProgression: {
                isGilded: gildedProgression ? gildedProgression.objectives[0].complete : undefined,
                gildedCount: gildedProgression ? gildedProgression.completedCount : undefined,
                isCompleted: profileProgression?.complete,
                completedTriumphCount: profileProgression?.progress || 0,
                totalTriumphCount: profileProgression?.completionValue || 0,
                completionPercentage:
                  profileProgression?.progress > 0
                    ? Math.floor((profileProgression?.progress / profileProgression?.completionValue) * 100)
                    : 0
              }
            } as unknown as SealClanMember;
          });
        })
      )
  }

  private getCompletionCount(memberProfiles: any, completionHash: any) {
    return memberProfiles.filter((m: any) => {
      const records = m.profile?.profileRecords?.data?.records[completionHash]?.objectives[0];

      if (records) {
        return records.complete;
      }
      return false;
    }).length;
  }
}
