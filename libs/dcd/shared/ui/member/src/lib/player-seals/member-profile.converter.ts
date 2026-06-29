import { MemberProfile } from '@dcd/shared/models';
import { PlayerSeal } from './player-seal';
import { DestinyDefinitionsPresentationDestinyPresentationNodeDefinition } from 'bungie-api-angular';
import {  DefinitionService } from '@dcd/shared/data-access/definitions';

export function convertSealAndProfile(
  seals: DestinyDefinitionsPresentationDestinyPresentationNodeDefinition[],
  profile: MemberProfile,
  definitionService: DefinitionService
): PlayerSeal[] {
  return seals.map((seal) => {
    // const record = records.find((r) => r.milestoneHash === seal.completionRecordHash);
    // There should only be one profile here
    //const profile = record.profiles[0];
    //const profileRecord = profile?.profileRecords?.data?.records[seal.completionRecordHash]?.objectives[0];
    //console.log(profileRecord);

    const sealCompletionHash = seals.find((h) => h.hash == seal.hash)?.completionRecordHash;
    const sealRecord = definitionService.recordDefinition[sealCompletionHash as number];
    const sealGildingRecord =
      sealRecord && sealRecord.titleInfo && sealRecord.titleInfo.gildingTrackingRecordHash
        ? sealRecord.titleInfo.gildingTrackingRecordHash
        : 0;

    const profileProgression = profile.profileRecords.data.records[sealCompletionHash!]?.objectives[0];
    const gildedProgression =
      sealGildingRecord > 0 ? profile.profileRecords.data.records[sealGildingRecord] : undefined;

    return {
      complete: profileProgression?.complete || false,
      gilded: gildedProgression ? gildedProgression.objectives[0].complete : undefined,
      gildedCount: gildedProgression ? gildedProgression.completedCount : undefined,

      progress:
        profileProgression?.progress > 0
          ? Math.floor((profileProgression?.progress / profileProgression?.completionValue) * 100)
          : 0,
      sealDescription: seal.displayProperties?.description,
      sealImage: seal.displayProperties?.icon,
      sealTitle: seal.displayProperties?.name
    } as PlayerSeal;
  });
}
