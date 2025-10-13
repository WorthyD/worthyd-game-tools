//@ts-nocheck

import { SorterMetadata } from '@dcd/shared/data-models';
import { ClanRosterItem } from '@dcd/clans-roster/models';
import { ClanMemberProfile } from '@dcd/shared/models';

export const CLAN_ROSTER_SORTER_METADATA = new Map<string, SorterMetadata<ClanRosterItem>>([
    [
    'destinyDisplayName',
    {
      label: 'Destiny Display Name',
      comparator: (a, b) =>
        a.member?.destinyUserInfo?.displayName?.toLowerCase() < b.member?.destinyUserInfo?.displayName?.toLowerCase()
          ? -1
          : 1
    }
  ],
  [
    'bungieDisplayName',
    {
      label: 'Bungie Display Name',
      comparator: (a, b) =>
        a.member?.bungieNetUserInfo?.displayName?.toLowerCase() <
        b.member?.bungieNetUserInfo?.displayName?.toLowerCase()
          ? -1
          : 1
    }
  ],
  [
    'platform',
    {
      label: 'Platform',
      comparator: (a, b) =>
        a.member?.destinyUserInfo?.membershipType < b.member?.destinyUserInfo?.membershipType ? -1 : 1
    }
  ],
  [
    'bungieUnique',
    {
      label: 'Bungie Unique Name',
      comparator: (a, b) => (a.bungieInfo?.uniqueName?.toLowerCase() < b.bungieInfo?.uniqueName?.toLowerCase() ? -1 : 1)
    }
  ],
  // ----
  [
    'psnDisplayName',
    {
      label: 'PSN Name',
      comparator: (a, b) =>
        a.bungieInfo?.psnDisplayName?.toLowerCase() < b.bungieInfo?.psnDisplayName?.toLowerCase() ? -1 : 1
    }
  ],
  [
    'xboxDisplayName',
    {
      label: 'XBox Name',
      comparator: (a, b) =>
        a.bungieInfo?.xboxDisplayName?.toLowerCase() < b.bungieInfo?.xboxDisplayName?.toLowerCase() ? -1 : 1
    }
  ],
  [
    'steamDisplayName',
    {
      label: 'Steam Name',
      comparator: (a, b) =>
        a.bungieInfo?.steamDisplayName?.toLowerCase() < b.bungieInfo?.steamDisplayName?.toLowerCase() ? -1 : 1
    }
  ],

  [
    'twitchDisplayName',
    {
      label: 'Twitch Name',
      comparator: (a, b) =>
        a.bungieInfo?.twitchDisplayName?.toLowerCase() < b.bungieInfo?.twitchDisplayName?.toLowerCase() ? -1 : 1
    }
  ],

  // ----
  [
    'powerLevel',
    {
      label: 'Power Level',
      comparator: (a, b) =>
        a.profile?.profileProgression?.data?.seasonalArtifact?.powerBonus <
        b.profile?.profileProgression?.data?.seasonalArtifact?.powerBonus
          ? -1
          : 1
    }
  ],
  [
    'rank',
    {
      label: 'Guardian Rank',
      comparator: (a, b) =>
        a.profile?.profile?.data?.currentGuardianRank < b.profile?.profile?.data?.currentGuardianRank ? -1 : 1
    }
  ],
  [
    'lifetimeRank',
    {
      label: 'Lifetime Guardian Rank',
      comparator: (a, b) =>
        a.profile?.profile?.data?.lifetimeHighestGuardianRank < b.profile?.profile?.data?.lifetimeHighestGuardianRank
          ? -1
          : 1
    }
  ],
  [
    'activeTriumph',
    {
      label: 'Active Triumph',
      comparator: (a, b) =>
        a.profile?.profileRecords?.data?.activeScore < b.profile?.profileRecords?.data?.activeScore ? -1 : 1
    }
  ],
  [
    'lifetimeTriumph',
    {
      label: 'Lifetime Triumph',
      comparator: (a, b) =>
        a.profile?.profileRecords?.data?.lifetimeScore < b.profile?.profileRecords?.data?.lifetimeScore ? -1 : 1
    }
  ],
  [
    'clanName',
    {
      label: 'Clan Name',
      comparator: (a, b) => (a.clan.clanName < b.clan.clanName ? -1 : 1)
    }
  ],

  [
    'joinDate',
    {
      label: 'Join Date',
      comparator: (a, b) => (new Date(a.member?.joinDate) < new Date(b.member?.joinDate) ? -1 : 1)
    }
  ],
  [
    'dateLastPlayed',
    {
      label: 'Date Last Played',
      comparator: (a, b) =>
        new Date(a.profile?.profile.data.dateLastPlayed) < new Date(b.profile?.profile.data.dateLastPlayed) ? -1 : 1
    }
  ]
]);
