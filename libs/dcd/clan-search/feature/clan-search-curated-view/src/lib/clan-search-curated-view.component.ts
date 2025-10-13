import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { ClanSearchService } from '@dcd/clan-search/data-access';
import { ALL_CLANS } from './curated_clans';
import { ClanConfig } from '@dcd/shared/models';

@Component({
  selector: 'app-clan-search-curated-view',
  templateUrl: './clan-search-curated-view.component.html',
  styleUrls: ['./clan-search-curated-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClanSearchCuratedViewComponent {
  constructor(private route: ActivatedRoute, private clanSearchService: ClanSearchService) {}

  activeClans$ = this.clanSearchService.clans$;

  clans$ = this.route.paramMap.pipe(
    map((params) => {
      return ALL_CLANS.find((x) => x.key === params.get('key'));
    })
  );
  vm$ = combineLatest([this.activeClans$, this.clans$]).pipe(
    map(([ac, c]) => {
      return {
        activeClans: ac,
        clans: c
      };
    })
  );

  // Don't ever do this on a big app.
  // I'm donig this in a controlled state and I'm
  // feeling too lazy to make a pipe
  clanIsActive(clan: ClanConfig, activeClans: ClanConfig[]) {
    return !activeClans.find((x) => x.clanId === clan.clanId);
  }
}
