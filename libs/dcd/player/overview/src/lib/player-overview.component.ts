import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, switchMap, tap } from 'rxjs';
import { PlayerService } from '@dcd/player/data-access';
import { BungieInfo } from '@dcd/shared/models';
import { convertSealAndProfile } from '@dcd/shared/ui/member';
import { BungieInfoService } from '@dcd/shared/data-access/bungie-info';
import { GlobalSealsService } from '@dcd/shared/data-access/seals';
import { DefinitionService } from '@dcd/shared/data-access/definitions';

interface MemberInfo {
  memberType: string;
  memberId: string;
}
@Component({
    selector: 'app-player-overview',
    templateUrl: './player-overview.component.html',
    styleUrls: ['./player-overview.component.scss'],
    standalone: false
})
export class PlayerOverviewComponent {
  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,

    private bungieInfoService: BungieInfoService,
    private globalSealsService: GlobalSealsService,
    private definitionService: DefinitionService
  ) {}
  memberInfo$: Observable<MemberInfo> = this.route.paramMap.pipe(
    map((params) => {
      const playerInfo = params.get('player-id');
      return { memberType: playerInfo!.split('-')[0], memberId: playerInfo!.split('-')[1] };
    })
  );

  profileLoadingSource$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  profileLoading$ = this.profileLoadingSource$.asObservable();

  profile$ = this.memberInfo$.pipe(
    tap(() => this.profileLoadingSource$.next(true)),
    switchMap((memberInfo) => this.playerService.getProfile(memberInfo.memberType, memberInfo.memberId)),
    tap(() => this.profileLoadingSource$.next(false))
  );

  memberSealInfo$ = this.profile$.pipe(
    map((x) => {
      return convertSealAndProfile(this.globalSealsService.sealNodesWLegacy, x, this.definitionService);
    })
  );

  // TODO: Look to see if this is a good spot for signal
  bungieInfoLoadingSource$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  bungieInfoLoading$ = this.bungieInfoLoadingSource$.asObservable();
  bungieInfo$ = this.profile$.pipe(
    filter((profile) => !!profile),
    switchMap((profile) => {
      this.bungieInfoLoadingSource$.next(true);
      return this.bungieInfoService.getBungieInformation(
        profile?.profile?.data?.userInfo?.membershipType ?? 0,
        profile?.profile?.data?.userInfo?.membershipId ?? 0
      );
    }),
    map((response) => {
      this.bungieInfoLoadingSource$.next(false);
      return response.Response as BungieInfo;
    })
  );
}
