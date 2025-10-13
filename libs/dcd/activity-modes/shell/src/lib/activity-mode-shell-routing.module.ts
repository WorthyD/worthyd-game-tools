import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@dcd/activity-modes/dashboard').then(
        (module) => module.ActivityModeDashboardModule
      )
  },
  //TODO // Guard
  {
    path: ':modeType',
    loadChildren: () =>
      import('@dcd/activity-modes/detail').then((module) => module.ActivityModeDetailModule)
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ActivityModeShellRoutingModule {}
