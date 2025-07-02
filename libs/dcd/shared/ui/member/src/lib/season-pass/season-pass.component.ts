import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ClanMemberSeasonPassProgression } from '@dcd/shared/models';

@Component({
  selector: 'lib-season-pass',
  imports: [MatProgressBarModule, MatCardModule, MatChipsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './season-pass.component.html',
  styleUrls: ['./season-pass.component.scss']
})
export class SeasonPassComponent {
  @Input()
  subTitle!: string;

  @Input()
  clanMemberSeasonPass!: ClanMemberSeasonPassProgression;

  @Input()
  isLoading!: boolean;

  get seasonPassProgress() {
    return (
      (this.clanMemberSeasonPass?.progression?.level ?? 0) +
      (this.clanMemberSeasonPass?.prestigeProgression?.level ?? 0)
    );
  }

  get seasonPassProgressBarValue() {
    return (
      ((this.clanMemberSeasonPass?.progression?.level ?? 0) / (this.clanMemberSeasonPass?.progression?.levelCap ?? 0)) *
      100
    );
  }
}
