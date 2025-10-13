import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClansDetailsDashboardComponent } from './clans-details-dashboard.component';
import { ClansDetailsModule } from '@dcd/dashboard/details';
import { ClansDetailsRoutingModule } from './clans-details-dashboard-routing.module';
import {
  ClansActivityCardModule,
  ClansHighestSeasonPassLevelCardModule,
  ClansInactiveCardModule,
  ClansRecentlyActiveCardModule
} from '@dcd/dashboard/cards';

@NgModule({
  declarations: [ClansDetailsDashboardComponent],
  imports: [
    CommonModule,
    ClansDetailsModule,
    ClansDetailsRoutingModule,
    ClansHighestSeasonPassLevelCardModule,
    ClansRecentlyActiveCardModule,
    ClansInactiveCardModule,
    ClansActivityCardModule
  ]
})
export class ClansDetailsDashboardModule {}
