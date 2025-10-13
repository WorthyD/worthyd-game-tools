import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 {
    path: '',
    loadChildren: () =>
      import('@dcd/activities/curated-dashboard').then(
        (module) => module.CuratedActivitiesDashboardModule
      )
  },

  {
    path: ':activityHash',
    loadChildren: () =>
      import('@dcd/activities/detail').then((module) => module.ActivityDetailModule)
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ActivitiesShellRoutingModule {}
