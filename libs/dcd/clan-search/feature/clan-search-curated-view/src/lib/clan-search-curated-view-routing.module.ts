import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClanSearchCuratedViewComponent } from './clan-search-curated-view.component';

const routes: Routes = [
  {
    path: '',
    component: ClanSearchCuratedViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClanSearchRoutingModule {}
