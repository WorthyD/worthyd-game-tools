import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Player } from '@dcd/player-sidebar/models';
import { computed, inject } from '@angular/core';
import { MemberProfile } from '@dcd/shared/models';
import { getMockProfile } from '../mock-objects/profile';

export interface MemberObj {
  membershipType: string;
  membershipId: string;
}
export interface PlayerSidebarState {
  profileLoading: boolean;
  loaded: boolean;
  profile?: MemberProfile;
  memberObj?: MemberObj;
}

const initialState: PlayerSidebarState = {
  profileLoading: false,
  loaded: false,
  memberObj: undefined,
  profile: undefined
};

export const PlayerSidebarStoreMock = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withComputed((store) => ({
    selectedProfile: computed(() => {
      if (store?.memberObj) {
        return store?.memberObj();
      }
      return undefined;
    })
  })),
  withMethods((store) => ({
    async load(membershipType: string, membershipId: string): Promise<void> {
      patchState(store, (state) => ({
        ...initialState,
        profileLoading: true,
        loading: true,
        memberObj: { membershipId, membershipType }
      }));

      const x = getMockProfile();

      patchState(store, { profile: x as unknown as Player });

      patchState(store, { profileLoading: false, loaded: true });
    },
    clear(): void {
      patchState(store, initialState);
    }
  }))
);

export type PlayerSidebarStoreMock = InstanceType<typeof PlayerSidebarStoreMock>;
