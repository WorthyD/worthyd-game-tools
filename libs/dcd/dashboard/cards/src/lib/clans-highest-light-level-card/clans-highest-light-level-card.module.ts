import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClansHighestLightLevelCardComponent } from './clans-highest-light-level-card.component';

import { ClanMemberCardComponent } from '@dcd/dashboard/ui';

@NgModule({
  declarations: [ClansHighestLightLevelCardComponent],
  exports: [ClansHighestLightLevelCardComponent],
  imports: [CommonModule, ClanMemberCardComponent]
})
export class ClansHighestLightLevelCardModule {}
