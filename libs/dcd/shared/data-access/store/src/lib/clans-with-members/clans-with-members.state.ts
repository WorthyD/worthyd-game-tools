import { ClanConfig } from '@dcd/shared/models';
import { AppState } from '../core.state';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GroupsV2GroupMember } from 'bungie-api-angular';

export interface ClanWithMembers {
  clanId: string;
  clan: ClanConfig;
  members: GroupsV2GroupMember[];
}

export interface ClansWithMembersState extends EntityState<ClanWithMembers> {}

export const ClanWithMembersConfigAdapter: EntityAdapter<ClanWithMembers> = createEntityAdapter<ClanWithMembers>({
  selectId: (cc: ClanWithMembers) => cc.clanId,
  sortComparer: false
});

export const initialClansWithMembersState: ClansWithMembersState = ClanWithMembersConfigAdapter.getInitialState({});

// export interface State extends AppState {
//   clansWithMembers: ClansWithMembersState;
// }

// export const DefaultClanConfig: ClanConfig = {
//   enabled: true,
//   memberUpdate: '1/1/1900',
//   profileUpdate: '1/1/1900',
//   memberRecentActivityUpdate: '1/1/1900',
//   bungieInfoUpdate: '1/1/1900'
// } as ClanConfig;
