import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
//import { ClansDetailsService } from '../data-access/clans-details.service';
import { ClansDetailsService } from '@dcd/dashboard/data-access';
import { PlayerSidebarStore } from '@dcd/player-sidebar/data-access';
import { MemberProfile } from '@dcd/shared/models';

@Component({
    selector: 'app-clans-details-dashboard',
    templateUrl: './clans-details-dashboard.component.html',
    styleUrls: ['./clans-details-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClansDetailsDashboardComponent {
  private playerSidebarStore = inject(PlayerSidebarStore);
  constructor(private clansDetailsService: ClansDetailsService) {}
  clans$ = this.clansDetailsService.activeClans$;

  viewProfile(profile: MemberProfile) {
    if (profile.profile?.data?.userInfo?.membershipType && profile.profile?.data?.userInfo?.membershipId) {
      this.playerSidebarStore.load(
        profile.profile?.data?.userInfo.membershipType?.toString(),
        profile.profile?.data?.userInfo?.membershipId.toString()
      );
    }
  }
}
