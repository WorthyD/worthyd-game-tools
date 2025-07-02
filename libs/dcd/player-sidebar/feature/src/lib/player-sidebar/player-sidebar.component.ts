import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';

import {
  MemberTypeIconComponent,
  CharacterCardComponent,
  SeasonPassComponent,
  BungieInfoComponent,
  MemberSharedOverviewComponent,
  PlayerSnapshotComponent
} from '@dcd/shared/ui/member';
import { PlayerSidebarStore } from '@dcd/player-sidebar/data-access';
import { Character, MemberProfile } from '@dcd/shared/models';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';

import { RouterModule } from '@angular/router';
import { ProfileUrlPipe } from '@dcd/shared/utils/pipes';
import { BungieDisplayNamePipe } from '../../../../../shared/utils/pipes/src/lib/bungie-display-name/bungie-display-name.pipe';
import { SeasonService } from '@dcd/shared/data-access/definitions';

@Component({
  selector: 'dcd-player-sidebar',
  standalone: true,
  imports: [
    MemberSharedOverviewComponent,
    CharacterCardComponent,
    MatIcon,
    MatIconButton,
    MatButtonModule,
    RouterModule,
    ProfileUrlPipe,
    BungieDisplayNamePipe,
    PlayerSnapshotComponent,
    SeasonPassComponent
],
  templateUrl: './player-sidebar.component.html',
  styleUrl: './player-sidebar.component.scss'
})
export class PlayerSidebarComponent {
  @Output() closeSidebar = new EventEmitter();

  readonly store = inject(PlayerSidebarStore);
  readonly seasonService = inject(SeasonService);

  profile = this.store.profile!();
  characters = computed(() => {
    const p = this.store.profile!();
    console.log(p);
    if (p) {
      return p.profile?.data?.characterIds?.map((id) => {
        return p.characters.data[id];
      });
    }
    return [];
  });

  seasonProgress = computed(() => {
    const p = this.store.profile!();
    const currentSeason = this.seasonService.currentSeasonProgress;
    console.log(p);
    console.log(currentSeason);
    const characterId = p?.profile?.data?.characterIds?.[0] || 0;

    if (characterId > 0 && p?.characterProgressions?.data[characterId]?.progressions) {
      console.log('here');
      const characterProgressions = p?.characterProgressions?.data[characterId].progressions;
      return {
        progression: characterProgressions[currentSeason!.rewardProgressionHash!],
        prestigeProgression: characterProgressions[currentSeason!.prestigeProgressionHash!]
      };
    }
    return undefined;
  });
}
