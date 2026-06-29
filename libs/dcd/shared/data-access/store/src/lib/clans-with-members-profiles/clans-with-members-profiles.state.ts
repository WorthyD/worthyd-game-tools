import { AppState } from '../core.state';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
//   import { ClanConfig } from '../../../../../../../libs/dcd/shared/data-access/store/src/lib/clans/clans.state';
import { GroupsV2GroupMember } from 'bungie-api-angular';
import { MemberProfile } from '@dcd/shared/models';
import { ClanConfig } from '@dcd/shared/models';

export interface ClanWithMembersAndProfiles {
  clanId: string;
  clan: ClanConfig;
  members: GroupsV2GroupMember[];
  profiles: MemberProfile[];
}

export interface ClansWithMembersAndProfilesState extends EntityState<ClanWithMembersAndProfiles> {}

export const ClanWithMembersProfilesConfigAdapter: EntityAdapter<ClanWithMembersAndProfiles> =
  createEntityAdapter<ClanWithMembersAndProfiles>({
    selectId: (cc: ClanWithMembersAndProfiles) => cc.clanId,
    sortComparer: false
  });

export const initialClanWithMembersAndProfileState: ClansWithMembersAndProfilesState =
  ClanWithMembersProfilesConfigAdapter.getInitialState({});

// export interface State extends AppState {
//   clansWithMembersAndProfiles: ClansWithMembersAndProfilesState;
// }

// export const DefaultClanConfig: ClanConfig = {
//   enabled: true,
//   memberUpdate: '1/1/1900',
//   profileUpdate: '1/1/1900',
//   memberRecentActivityUpdate: '1/1/1900',
//   bungieInfoUpdate: '1/1/1900'
// } as ClanConfig;
