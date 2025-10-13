import { ViewerMetadata } from '@dcd/shared/data-models';
import { getBungieDisplayName } from '@dcd/shared/utils';
import {ProfileRecentActivity} from '@dcd/activity-modes/models';

import { ProfileLinkComponent } from '@dcd/shared/ui/profile-link';
import { BungieDateTimePipe, PlaytimePipe } from '@dcd/shared/utils/pipes';

export interface ActivityModeViewContext {
  item: ProfileRecentActivity;
  playTimePipe: PlaytimePipe;
  dateTimePipe: BungieDateTimePipe;
}
export const ACTIVITY_MODE_VIEWER_METADATA = new Map<
  string,
  ViewerMetadata<ProfileRecentActivity, ActivityModeViewContext>
>([

  [
    'bungieUnique',
    {
      label: 'Bungie Display Name',
      labelClass: '',
      plainText: (item: ProfileRecentActivity) => `${getBungieDisplayName(item?.profile) || ''}`,
      render: (item: ProfileRecentActivity) => ({
        component: ProfileLinkComponent,
        data: { profile: item?.profile }
      })
    }
  ],
  [
    'clanName',
    {
      label: 'Clan Name',
      plainText: (item: ProfileRecentActivity) => `${item.clan.clanName}`,
      render: (item: ProfileRecentActivity) => {
        return {
          text: `${item.clan.clanName}`
        };
      }
    }
  ]

]);
