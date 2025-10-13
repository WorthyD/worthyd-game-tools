// @ts-nocheck
import { MemberTypeComponent } from '@dcd/shared/ui/icons';
import { ClassCellComponent } from '../../../../ui/src/lib/class-cell/class-cell.component';
import { MembershipTypes } from '@dcd/shared/models';
import { ClanRosterItem } from '@dcd/clans-roster/models';
import { ProfileLinkComponent } from '@dcd/shared/ui/profile-link';
import { BungieDatePipe, BungieDateTimePipe } from '@dcd/shared/utils/pipes';
import { ViewerMetadata } from '@dcd/shared/data-models';

interface ViewContext {
  item: ClanRosterItem;
  datePipe: BungieDatePipe;
  dateTimePipe: BungieDateTimePipe;
}

export const CLAN_ROSTER_VIEWER_METADATA = new Map<string, ViewerMetadata<ClanRosterItem, ViewContext>>([
  [
    'platform',
    {
      label: 'Platform',
      plainText: (item: ClanRosterItem) => `${getMembershipType(item.member.destinyUserInfo.membershipType)}`,
      render: (item: ClanRosterItem) => ({
        classList: ['text-center'],
        component: MemberTypeComponent,
        data: { type: item.member?.destinyUserInfo?.membershipType || 0 }
      })
    }
  ],
  [
    'bungieUnique',
    {
      label: 'Bungie Unique Name',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item?.bungieInfo?.uniqueName || ''}`,
      render: (item: ClanRosterItem) => ({
        component: ProfileLinkComponent,
        data: { profile: item?.profile }
      })
    }
  ],
  [
    'destinyDisplayName',
    {
      label: 'Destiny Display Name',
      labelClass: '',
      isSticky: true,
      plainText: (item: ClanRosterItem) => `${item.member?.destinyUserInfo?.displayName || ''}`,
      render: (item: ClanRosterItem) => ({
        text: `${item.member?.destinyUserInfo?.displayName || ''}`,
        classList: []
      })
    }
  ],
  [
    'bungieDisplayName',
    {
      label: 'Bungie Display Name',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item.member?.bungieNetUserInfo?.displayName || ''}`,
            render: (item: ClanRosterItem) => ({
        text: `${item.member?.bungieNetUserInfo?.displayName || ''}`,
        classList: []
      })
    }
  ],

  [
    'psnName',
    {
      label: 'PSN Name',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item?.bungieInfo?.psnDisplayName || ''}`,
      render: (item: ClanRosterItem) => ({ text: `${item.bungieInfo?.psnDisplayName || ''}`, classList: [] })
    }
  ],
  [
    'xboxName',
    {
      label: 'XBox Name',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item?.bungieInfo?.xboxDisplayName || ''}`,
      render: (item: ClanRosterItem) => ({ text: `${item.bungieInfo?.xboxDisplayName || ''}`, classList: [] })
    }
  ],
  [
    'steamName',
    {
      label: 'Steam Name',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item?.bungieInfo?.steamDisplayName || ''}`,
      render: (item: ClanRosterItem) => ({ text: `${item.bungieInfo?.steamDisplayName || ''}`, classList: [] })
    }
  ],
  [
    'twitchName',
    {
      label: 'Twitch Name',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item?.bungieInfo?.twitchDisplayName || ''}`,
      render: (item: ClanRosterItem) => ({
        text: `${item.bungieInfo?.twitchDisplayName || ''}`,
        classList: []
      })
    }
  ],
  [
    'characters',
    {
      label: 'Characters',
      labelClass: 'header-text-center',
      plainText: (item: ClanRosterItem) => ``,
      render: (item: ClanRosterItem) => {
        const characterIds = item.profile?.profile?.data?.characterIds;
        return {
          classList: 'characters-cell',
          children: characterIds?.map((id) => {
            return {
              classList: 'character-cell',
              component: ClassCellComponent,
              data: {
                characterHash: id,
                profile: item.profile
              }
            };
          })
        };
      }
    }
  ],
  [
    'powerLevel',
    {
      label: '+',
      labelClass: 'header-text-center',
      plainText: (item: ClanRosterItem) => `${item.profile?.profileProgression?.data?.seasonalArtifact?.powerBonus}`,
      render: (item: ClanRosterItem) => ({
        classList: 'power-cell',
        text: `${item.profile?.profileProgression?.data?.seasonalArtifact?.powerBonus}`
      })
    }
  ],
  [
    'rank',
    {
      label: 'Guardian Rank',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item.profile?.profile?.data?.currentGuardianRank}`,
      render: (item: ClanRosterItem) => ({
        classList: ['text-center'],
        text: `${item.profile?.profile?.data?.currentGuardianRank}`
      })
    }
  ],
  [
    'lifetimeRank',
    {
      label: 'Lifetime Guardian Rank',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item.profile?.profile?.data?.lifetimeHighestGuardianRank}`,
      render: (item: ClanRosterItem) => ({
        classList: ['text-center'],
        text: `${item.profile?.profile?.data?.lifetimeHighestGuardianRank}`
      })
    }
  ],
  [
    'activeTriumph',
    {
      label: 'Active Triumph',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item.profile?.profileRecords?.data?.activeScore}`,
      render: (item: ClanRosterItem) => ({
        classList: ['text-center'],
        text: `${item.profile?.profileRecords?.data?.activeScore}`
      })
    }
  ],
  [
    'lifetimeTriumph',
    {
      label: 'Lifetime Triumph',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item.profile?.profileRecords?.data?.lifetimeScore}`,
      render: (item: ClanRosterItem) => ({
        classList: ['text-center'],
        text: `${item.profile?.profileRecords?.data?.lifetimeScore}`
      })
    }
  ],
  [
    'clan',
    {
      label: 'Clan',
      labelClass: '',
      plainText: (item: ClanRosterItem) => `${item.clan.clanName}`,
      render: (item: ClanRosterItem, context: ViewContext) => {
        return {
          text: `${item.clan.clanName}`,
          classList: []
        };
      }
    }
  ],
  [
    'bungieProfileCreation',
    {
      label: 'Bungie Join Date',
      labelClass: '',
      plainText: (item: ClanRosterItem, context: ViewContext) =>
        `${context.datePipe.transform(item.bungieInfo?.firstAccess || (new Date() as unknown as Date))}`,
      render: (item: ClanRosterItem, context: ViewContext) => {
        return {
          text: `${context.datePipe.transform(item.bungieInfo?.firstAccess || (new Date() as unknown as Date))}`,
          classList: []
        };
      }
    }
  ],
  [
    'clanJoinDate',
    {
      label: 'Clan Join Date',
      labelClass: '',
      plainText: (item: ClanRosterItem, context: ViewContext) =>
        `${context.datePipe.transform(item.member?.joinDate as unknown as Date)}`,
      render: (item: ClanRosterItem, context: ViewContext) => {
        return {
          text: `${context.datePipe.transform(item.member?.joinDate as unknown as Date)}`,
          classList: []
        };
      }
    }
  ],
  [
    'dateLastPlayed',
    {
      label: 'Last Played',
      labelClass: '',
      plainText: (item: ClanRosterItem, context: ViewContext) =>
        `${context.dateTimePipe.transform(item.profile?.profile.data.dateLastPlayed as unknown as Date)}`,
      render: (item: ClanRosterItem, context: ViewContext) => {
        return {
          text: `${context.dateTimePipe.transform(item.profile?.profile.data.dateLastPlayed as unknown as Date)}`
        };
      }
    }
  ]

  //['name', { label: 'Name', render: (item) => ({ text: `${item.name}` }) }],
  //['startDate', { label: 'Start Date', render: (item) => ({ text: `${new Date(item.startDate).toDateString()}` }) }]
]);

function getMembershipType(value) {
  switch (value) {
    case MembershipTypes.Xbox:
      return 'xbox';
    case MembershipTypes.Psn:
      return 'playstation';
    case MembershipTypes.Steam:
      return 'steam';
    case MembershipTypes.Stadia:
      return 'stadia';
    default:
      return ``;
  }
}
