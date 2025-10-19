import { createSelector, createFeatureSelector } from '@ngrx/store';

// import { ClansMembersProfilesState, ClansMembersProfilesAdapter } from './clan-members-profiles.state';
//import { selectAllClansWithMembers } from '../clans-with-members/clans-with-members.selectors';
//import { selectAllClansWithMembersProfiles } from '../clans-with-members-profiles/clans-with-members-profiles.selectors';
import { ClanMemberProfile } from '@dcd/shared/models';
import { getClanMemberId, getMemberProfileId } from '@dcd/shared/utils';
import { MemberProfile } from '@dcd/shared/models';
import { selectAllClansWithMembers } from '../clans-with-members';
import { selectAllClansWithMembersProfiles } from '../clans-with-members-profiles';

//export const selectClanMemberProfileState = createFeatureSelector<ClansMembersProfilesState>('clansMembersProfiles');

// export const {
//   //selectIds,
//   //selectEntities,
//   selectAll: selectAllClansMembersProfiles2
//   //selectTotal
// } = ClansMembersProfilesAdapter.getSelectors(selectClanMemberProfileState);

export const selectAllClansMembersProfiles = createSelector(
  selectAllClansWithMembers,
  selectAllClansWithMembersProfiles,
  (clansAndMembers, clansAndMembersProfiles) => {
    if (clansAndMembers.length === 0 || clansAndMembersProfiles.length === 0) {
      return [];
    }
    const result: ClanMemberProfile[] = [];

    clansAndMembers.forEach((clanAndMember) => {
      const CMP = clansAndMembersProfiles.find((x) => x.clanId === clanAndMember.clanId);

      clanAndMember?.members?.forEach((member) => {
        result.push({
          clan: {
            clanId: clanAndMember.clan.clanId,
            clanName: clanAndMember.clan.clanName,
            clanTag: clanAndMember.clan.clanTag
          },
          member,
          profile: CMP?.profiles.find((profile) => {
            return getClanMemberId(member) === getMemberProfileId(profile as MemberProfile);
          }) as MemberProfile
        });
      });
    });
    return result;
  }
);
export const selectClanMemberProfileStateLoading = createSelector(
  selectAllClansMembersProfiles,
  (state) => state.length === 0
);
