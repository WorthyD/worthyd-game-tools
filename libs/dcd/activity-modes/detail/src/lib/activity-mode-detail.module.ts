import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModeDetailComponent } from './activity-mode-detail.component';
import { ActivityModeDetailRoutingModule } from './activity-mode-detail-routes.module';
import { ActivityModeTableModule } from '@dcd/activity-modes/table';

@NgModule({
  declarations: [ActivityModeDetailComponent],
  imports: [CommonModule, ActivityModeDetailRoutingModule, ActivityModeTableModule]
})
export class ActivityModeDetailModule {}
