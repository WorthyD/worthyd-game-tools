
import { SorterMetadata } from '@dcd/shared/data-models';
import { compare, getBungieDisplayName } from '@dcd/shared/utils';
import { ClanMemberProfile } from '@dcd/shared/models';

export const ACTIVITY_SORTER_METADATA = new Map<string, SorterMetadata<ClanMemberProfile>>([
 [
    'destinyDisplayName',
    {
      label: 'Bungie Display Name',
      comparator: (a, b) =>
        compare(getBungieDisplayName(a.profile).toLowerCase(), getBungieDisplayName(b.profile).toLowerCase())
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
