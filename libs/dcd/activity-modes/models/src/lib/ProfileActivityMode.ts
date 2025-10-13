import { MemberProfile } from '@dcd/shared/models';
import { GroupsV2GroupMember } from 'bungie-api-angular/lib/model/groupsV2GroupMember';
import { MemberActivityRecentStats } from '@dcd/shared/models';

export interface ProfileRecentActivity {
  clan: {
    clanId: string;
    clanName: string;
    clanTag: string;
  };
  member: GroupsV2GroupMember;
  profile: MemberProfile;
  stats: MemberActivityRecentStats;
}
