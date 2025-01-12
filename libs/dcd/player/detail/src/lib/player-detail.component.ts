import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
// import { PlayerService } from '../data-access/player.service';
import { PlayerService } from '@dcd/player/data-access';

interface MemberInfo {
  memberType: string;
  memberId: string;
}
@Component({
    selector: 'app-player-detail',
    templateUrl: './player-detail.component.html',
    styleUrls: ['./player-detail.component.scss'],
    standalone: false
})
export class PlayerDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {}
  memberInfo$: Observable<MemberInfo> = this.route.paramMap.pipe(
    map((params) => {
      const playerInfo = params.get('player-id');
      return { memberType: playerInfo?.split('-')[0] ?? '', memberId: playerInfo?.split('-')[1] ?? '' };
    })
  );

  profile$ = this.memberInfo$.pipe(
    switchMap((memberInfo) => this.playerService.getProfile(memberInfo.memberType, memberInfo.memberId))
  );
}
