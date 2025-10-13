import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerOverviewComponent } from './player-overview.component';
import { ClansDetailsRoutingModule } from './player-overview-routes.module';
import { MemberOverviewComponent } from '@dcd/player/ui';
import { PlayerSealsComponent, BungieInfoComponent } from '@dcd/shared/ui/member';

@NgModule({
  declarations: [PlayerOverviewComponent],
  imports: [CommonModule, ClansDetailsRoutingModule, MemberOverviewComponent, PlayerSealsComponent, BungieInfoComponent]
})
export class PlayerOverviewModule {}
