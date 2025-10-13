import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModeDashboardComponent } from './activity-mode-dashboard.component';
import { ActivityModeDashboardRoutingModule } from './activity-dashboard-routes.module';
import { ActivityModeCardDetailsComponent } from '@dcd/activity-modes/ui';

@NgModule({
  declarations: [ActivityModeDashboardComponent],
  imports: [CommonModule, ActivityModeDashboardRoutingModule, ActivityModeCardDetailsComponent]
})
export class ActivityModeDashboardModule {}
