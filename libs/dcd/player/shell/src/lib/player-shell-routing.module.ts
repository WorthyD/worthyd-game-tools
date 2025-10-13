import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerDetailComponent } from '@dcd/player/detail';

const routes: Routes = [
  {
    path: ':player-id',
    component: PlayerDetailComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@dcd/player/overview').then((module) => module.PlayerOverviewModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerShellRoutingModule {}
