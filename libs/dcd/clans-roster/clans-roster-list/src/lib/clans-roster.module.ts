import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClansRosterComponent } from './clans-roster.component';
import { TableViewComponent } from '@dcd/shared/ui/table-view';

import { ClassCellComponent, ClassIconPipe } from '@dcd/clans-roster/ui';
import { ClansRosterRoutingModule } from './clan-roster-routing.module.ts';
import { BungieDatePipe, BungieDateTimePipe } from '@dcd/shared/utils/pipes';

@NgModule({
  declarations: [ClansRosterComponent],
  providers: [BungieDatePipe, BungieDateTimePipe],
  exports: [ClansRosterComponent],
  imports: [CommonModule, TableViewComponent, ClansRosterRoutingModule, ClassCellComponent, ClassIconPipe]
})
export class ClansRosterModule {}
