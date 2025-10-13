
import { SorterMetadata } from '@dcd/shared/data-models';
import { getBungieDisplayName } from '@dcd/shared/utils';
import {ProfileRecentActivity} from '@dcd/activity-modes/models';

export const ACTIVITY_MODE_SORTER_METADATA = new Map<string, SorterMetadata<ProfileRecentActivity>>([
  [
    'destinyDisplayName',
    {
      label: 'Destiny Display Name',
      comparator: (a, b) =>
        getBungieDisplayName(a.profile).toLowerCase() < getBungieDisplayName(b.profile).toLowerCase() ? -1 : 1
    }
  ],
  [
    'clanName',
    {
      label: 'Clan Name',
      comparator: (a, b) => (a.clan.clanName?.toLowerCase() < b.clan.clanName?.toLowerCase() ? -1 : 1)
    }
  ]

]);
