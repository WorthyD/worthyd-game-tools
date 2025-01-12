import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { ClansDetailsService } from '@dcd/dashboard/data-access';
import { MemberProfile } from '@dcd/shared/models';

@Component({
    selector: 'app-clans-recently-active-card',
    templateUrl: './clans-recently-active-card.component.html',
    styleUrls: ['./clans-recently-active-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClansRecentlyActiveCardComponent {
  @Output() viewProfile = new EventEmitter<MemberProfile>();
  constructor(private clansDetailsService: ClansDetailsService) {}

  lastLoginMembers$ = this.clansDetailsService.lastLoginMembers$.pipe(startWith([]));
  isLoading$ = this.clansDetailsService.clanProfilesLoading$;
  vm$ = combineLatest([this.lastLoginMembers$, this.isLoading$]).pipe(
    map(([lastLoginMembers, isLoading]) => ({
      lastLoginMembers,
      isLoading
    }))
  );
}
