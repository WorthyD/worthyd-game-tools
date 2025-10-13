import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClansHighestSeasonPassLevelCardComponent } from './clans-highest-season-pass-level-card.component';
import {ClanMemberCardComponent} from '@dcd/dashboard/ui';

@NgModule({
  declarations: [ClansHighestSeasonPassLevelCardComponent],
  exports: [ClansHighestSeasonPassLevelCardComponent],
  imports: [CommonModule, ClanMemberCardComponent]
})
export class ClansHighestSeasonPassLevelCardModule {}
