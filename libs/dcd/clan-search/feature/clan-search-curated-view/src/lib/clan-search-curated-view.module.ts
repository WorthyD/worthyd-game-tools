import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClanSearchCuratedViewComponent } from './clan-search-curated-view.component';
import { ClanDetailComponent } from '@dcd/shared/clan-details/feature';
import { ClanSearchRoutingModule } from './clan-search-curated-view-routing.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ClanSearchCuratedViewComponent],
  imports: [CommonModule, ClanDetailComponent, ClanSearchRoutingModule, MatButtonModule]
})
export class ClanSearchCuratedViewModule {}
