import { Injectable } from '@angular/core';
import { Destiny2Service, UserService } from 'bungie-api-angular';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BungieInfoService {
  constructor(
    private destiny2Service: Destiny2Service,
    private userService: UserService
  ) {}
  public getBungieInformation(memberType: number, memberId: number) {
    return this.destiny2Service.destiny2GetLinkedProfiles(memberId, memberType).pipe(
      switchMap((x) => this.userService.userGetBungieNetUserById(x.Response?.bnetMembership?.membershipId as number)),
      tap((x) => console.log('bungie info mock service', x))
    );
  }
}
