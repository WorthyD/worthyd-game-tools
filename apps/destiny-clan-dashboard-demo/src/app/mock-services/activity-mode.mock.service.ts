import { DESTINY_ACTIVITY_MODES } from '@dcd/shared/models';
import { DefinitionService } from '@dcd/shared/data-access/definitions';
import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { DestinyDefinitionsDestinyActivityModeDefinition } from 'bungie-api-angular';
import { Store } from '@ngrx/store';
import { selectAllClansWithMembersProfiles } from '@dcd/shared/data-access/store';
import { ClanConfigMembers } from '@dcd/shared/models';
import { TrackedDuration } from '@dcd/shared/utils/serializers';

@Injectable()
export class ActivityModeMockService {
  constructor(
    private definitionService: DefinitionService

    //private store: Store,
    //private profileRecentActivityWorkerService: ProfileRecentActivityWorkerService
  ) {}

  clanMembersProfiles$ = of(null); // this.store.select(selectAllClansWithMembersProfiles);
  readonly ignoredModes = [
    16, // NFStrikes - no stats
    66, // Forges
    17, // Prestiege NF
    58, // Heroic adv
    47, // Scored Pres NF
    77, // Menagerie
    78, // Vex offensive
    83, // SUndial
    76, // Reckoning
    72, // Clash comp
    74, // Control comp,
    67, // Salvage
    42, // Trials 9 survival
    15, // crimson doubles
    39, // Trials of nine
    38, // Countdown
    49, // Doubles
    41, // Trials 9 count
    50, // Doubles
    31, // Supremecy.
    68, // IB Salvage
    43, // IB Control
    44, // IB control
    45, // IB Supremacy
    90, // IB Rift
    61, // Scorched
    60, // Lockdown
    65, // Break through
    80, // Elimination
    89, // Zone control
    75 // GB Prime
  ];

  getActivityModeDefinition(modeType: number) {
    const x = Object.keys(this.definitionService.activityModeDefinition).map(
      // @ts-ignore
      (x) => this.definitionService.activityModeDefinition[x]
    ) as DestinyDefinitionsDestinyActivityModeDefinition[];
    return x.find((y) => y.modeType === modeType);
  }

  getGroupedActivityModes() {
    const groups = DESTINY_ACTIVITY_MODES;
    const definitions = Object.keys(this.definitionService.activityModeDefinition).map(
      // @ts-ignore
      (x) => this.definitionService.activityModeDefinition[x]
    );
    return groups.map((x) => {
      return {
        group: x,
        activities: definitions
          .filter(
            (mode) =>
              mode.activityModeCategory === x.id &&
              mode.redacted === false &&
              mode.blacklisted === false &&
              mode.display === true &&
              this.ignoredModes.indexOf(mode.modeType) === -1
          )
          .sort((a, b) => a.order - b.order)
      };
    });
  }

  getAllActivitiesByMode(mode: number, trackedDates: TrackedDuration[]) {
    return of(null);
    // return this.clanMembersProfiles$.pipe(
    //   switchMap((clanMembersProfiles) => {
    //     return this.profileRecentActivityWorkerService.getAllRecentClanActivitiesByActivityModeId(
    //       clanMembersProfiles as unknown as ClanConfigMembers[],
    //       trackedDates,
    //       mode,
    //       0
    //     );
    //     return of(clanMembersProfiles);
    //   })
    // );
  }
}
