import { Route } from '@angular/router';
import { WrapperComponent, ClanResolveGuard } from '@dcd/layout';
export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [ClanResolveGuard],
    component: WrapperComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@dcd/dashboard/shell').then((module) => module.ClansDetailsModule)
      },
      {
        path: 'roster',
        loadChildren: () => import('@dcd/clans-roster/shell').then((module) => module.ClansRosterModule)
      },
      {
        path: 'seals',
        loadChildren: () => import('@dcd/seals/feature/seals-shell').then((module) => module.SealsRoutingModule)
      },
      {
        path: 'activities',
        loadChildren: () => import('@dcd/activities/shell').then((module) => module.ActivitiesShellModule)
      },
      {
        path: 'player',
        loadChildren: () => import('@dcd/player/shell').then((module) => module.PlayerShellModule)
      },
      {
        path: 'activity-modes',
        loadChildren: () => import('@dcd/activity-modes/shell').then((module) => module.ActivityModeShellModule)
      },
      {
        path: 'config',
        loadChildren: () => import('@dcd/config/shell').then((module) => module.ConfigShellModule)
      },
      {
        path: 'sandbox',
        loadChildren: () => import('@dcd/sandbox').then((module) => module.SandboxShellModule)
      }
    ]
  },
  {
    path: 'home',
    // TODO: Clan Guard
    //canActivate: [ClanResolveGuard],
    loadChildren: () => import('@dcd/clan-search/feature/shell').then((module) => module.ClanSearchModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
