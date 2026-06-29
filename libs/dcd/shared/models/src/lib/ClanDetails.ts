import { GroupsV2GroupV2 } from 'bungie-api-angular';

// Extends GroupsV2GroupV2 from bungie api
export interface ClanDetails extends Omit<GroupsV2GroupV2, 'groupId' | 'conversationId'> {
  groupId: number | string;
  conversationId?: number | string;
  // name: string;
  // creationDate: string;
  // about: string;
  // memberCount: number;

  // clanInfo: {
  //   clanCallsign: string;
  //   d2ClanProgressions?: { [key: string]: ClanProgression };
  // };
}

// interface ClanProgression {
//   progressionHash?: number;
//   dailyProgress?: number;
//   dailyLimit?: number;
//   weeklyProgress?: number;
//   weeklyLimit?: number;
//   currentProgress?: number;
//   level?: number;
//   levelCap?: number;
//   stepIndex?: number;
//   progressToNextLevel?: number;
//   nextLevelAt?: number;
// }
