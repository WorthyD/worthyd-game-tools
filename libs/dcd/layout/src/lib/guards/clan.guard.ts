import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { selectTotalClans } from '@dcd/shared/data-access/store';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClanResolveGuard  {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(selectTotalClans).pipe(
      map((clans) => {
        if (!clans || clans === 0) {
          return this.router.parseUrl('/home');
        }
        return true;
      })
    );
  }
}
