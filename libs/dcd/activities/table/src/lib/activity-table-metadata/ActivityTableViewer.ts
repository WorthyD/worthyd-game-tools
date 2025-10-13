import { ViewerMetadata } from '@dcd/shared/data-models';
import { getBungieDisplayName } from '@dcd/shared/utils';
import { ClanMemberProfile } from '@dcd/shared/models';
import { ProfileLinkComponent } from '@dcd/shared/ui/profile-link';

interface ViewContext {
  item: ClanMemberProfile;
}
export const ACTIVITY_VIEWER_METADATA = new Map<string, ViewerMetadata<ClanMemberProfile, ViewContext>>([
  [
    'bungieUnique',
    {
      label: 'Bungie Display Name',
      labelClass: '',
      isSticky: true,
      plainText: (item: ClanMemberProfile) => `${getBungieDisplayName(item?.profile) || ''}`,
      render: (item: ClanMemberProfile) => ({
        component: ProfileLinkComponent,
        data: { profile: item?.profile }
      })
    }
  ],
  [
    'clanName',
    {
      label: 'Clan Name',
      plainText: (item: ClanMemberProfile) => `${item.clan.clanName}`,
      render: (item: ClanMemberProfile) => {
        return {
          text: `${item.clan.clanName}`
        };
      }
    }
  ]
]);
