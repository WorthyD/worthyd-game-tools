import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { ClansDetailsService } from '@dcd/dashboard/data-access';

@Component({
    selector: 'app-clans-highest-light-level-card',
    templateUrl: './clans-highest-light-level-card.component.html',
    styleUrls: ['./clans-highest-light-level-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClansHighestLightLevelCardComponent {
  constructor(private clansDetailsService: ClansDetailsService) {}

  highestPowerMembers$ = this.clansDetailsService.highestPowerBonusMembers$.pipe(startWith([]));
  isLoading$ = this.clansDetailsService.clanProfilesLoading$;
  vm$ = combineLatest([this.highestPowerMembers$, this.isLoading$]).pipe(
    map(([highestPowerMembers, isLoading]) => ({
      highestPowerMembers,
      isLoading
    }))
  );
}
