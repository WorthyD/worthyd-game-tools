import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
// import { ClanConfig } from '@core/store/clans';
import { GroupsV2GroupV2 } from 'bungie-api-angular';
import { combineLatest, map, Observable, tap } from 'rxjs';
//import { ClansDetailsService } from '../data-access/clans-details.service';
import { ClansDetailsService } from '@dcd/dashboard/data-access';
import { ClanConfig } from '@dcd/shared/models';

@Component({
    selector: 'app-clans-details',
    templateUrl: './clans-details.component.html',
    styleUrls: ['./clans-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClansDetailsComponent implements OnChanges {
  constructor(private clansDetailsService: ClansDetailsService) {}
  // clansInfo$ = this.clansDetailsService.clanInfo$;
  // clansInfoLoading$ = this.clansDetailsService.clansInfoLoading$;
  // vm$ = combineLatest([this.clansInfo$, this.clansInfoLoading$]).pipe(
  //   map(([clansInfo, clansLoading]) => ({
  //     clansInfo,
  //     clansLoading
  //   }))
  // );
  @Input() clanConfig!: ClanConfig;
  clanDetails$!: Observable<GroupsV2GroupV2>;
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clanConfig']) {
      this.loading = true;
      if (this.clanConfig.clanId) {
        this.clanDetails$ = this.clansDetailsService
          .getClan(this.clanConfig.clanId)
          .pipe(tap(() => (this.loading = false)));
      }
    }
  }
}
