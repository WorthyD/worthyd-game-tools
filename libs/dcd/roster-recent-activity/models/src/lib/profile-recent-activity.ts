import { MemberProfile } from '@dcd/shared/models';
import { GroupsV2GroupMember } from 'bungie-api-angular';
import { ActivityStats } from '@dcd/shared/models';
//import { GroupsV2GroupMember } from 'bungie-api-angular/';

export interface ProfileRecentActivity {
  clan: {
    clanId: string;
    clanName: string;
    clanTag: string;
  };
  clanMember: GroupsV2GroupMember;
  profile: MemberProfile;
  profileActivity: ActivityStats;
}
