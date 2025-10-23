import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClansDetailsComponent } from './clans-details.component';
import { ClansDetailsService } from '@dcd/dashboard/data-access';
import { MemberTypeComponent } from '@dcd/shared/ui/icons';
import { ClanInfoComponent } from '@dcd/dashboard/ui';

@NgModule({
  declarations: [ClansDetailsComponent],
  //providers: [ClansDetailsService],
  exports: [ClansDetailsComponent],
  imports: [CommonModule, MemberTypeComponent, ClanInfoComponent]
})
export class ClansDetailsModule {}
