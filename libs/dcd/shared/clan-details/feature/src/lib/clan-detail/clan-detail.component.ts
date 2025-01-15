import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ClanDetailService } from '@dcd/shared/clan-details/data-access';
import { Observable, of, tap } from 'rxjs';
import { GroupsV2GroupV2 } from 'bungie-api-angular';
import { CommonModule } from '@angular/common';
import { ClanDetailCellComponent } from '@dcd/shared/clan-details/ui';
import { ClanConfig } from '@dcd/shared/models';

@Component({
  selector: 'app-clan-detail',
  templateUrl: './clan-detail.component.html',
  styleUrls: ['./clan-detail.component.scss'],
  imports: [CommonModule, ClanDetailCellComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClanDetailComponent implements OnChanges {
  // export class ClanDetailComponent {
  @Input() clanConfig: ClanConfig | undefined = undefined;
  @Input() showAdd: boolean = false;
  @Input() showReset: boolean = false;

  constructor(private clanDetailService: ClanDetailService) {}

  clanDetails$: Observable<GroupsV2GroupV2 | undefined> = of(undefined);

  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clanConfig']) {
      this.loading = true;
      if (this.clanConfig?.clanId) {
        this.clanDetails$ = this.clanDetailService
          .getClan(this.clanConfig.clanId)
          .pipe(tap(() => (this.loading = false)));
      }
    }
  }

  removeClan(clanId: string) {
    this.clanDetailService.removeClan(clanId);
  }
  addClan(clanDetail: GroupsV2GroupV2) {
    this.clanDetailService.addClan(clanDetail);
  }
  resetClan(clanDetail: GroupsV2GroupV2) {
    this.clanDetailService.resetClan(clanDetail);
  }
}
