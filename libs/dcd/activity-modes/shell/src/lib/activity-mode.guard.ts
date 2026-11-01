// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// import { ActivityModeShellModule } from '../activity-mode-shell/activity-mode-feature-shell.module';
// import { ActivityModeService } from '../data-access/activity-mode.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ActivityModeResolveGuard implements CanActivate {
//   constructor(private activitiesService: ActivityModeService, private router: Router) {}

//   //TODO: There is a bug with trying to leverage this. Leaving this for now.
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     // const modeType = +route.paramMap.get('modeType');
//     // const mode = this.activitiesService.getActivityModeDefinition(modeType);
//     // if (!mode) {
//     //   return this.router.parseUrl('/activity-modes');
//     // }
//     return true;

//     // this.store.select(selectTotalClans).pipe(
//     //   map((clans) => {
//     //     if (!clans || clans === 0) {
//     //       return this.router.parseUrl('/clan-search');
//     //     }
//     //     return true;
//     //   })
//     // );
//   }
// }
