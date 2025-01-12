import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { ClansDetailsService } from '@dcd/dashboard/data-access';
import { MemberProfile } from '@dcd/shared/models';

@Component({
    selector: 'app-clans-inactive-card',
    templateUrl: './clans-inactive-card.component.html',
    styleUrls: ['./clans-inactive-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClansInactiveCardComponent {
  @Output() viewProfile = new EventEmitter<MemberProfile>();
  constructor(private clansDetailsService: ClansDetailsService) {}

  inactiveMemberList$ = this.clansDetailsService.inactiveMemberList$.pipe(startWith([]));
  isLoading$ = this.clansDetailsService.clanProfilesLoading$;
  vm$ = combineLatest([this.inactiveMemberList$, this.isLoading$]).pipe(
    map(([inactiveMemberList, isLoading]) => ({
      inactiveMemberList,
      isLoading
    }))
  );
}
