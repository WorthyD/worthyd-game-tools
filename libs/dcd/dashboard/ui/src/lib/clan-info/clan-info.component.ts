//@ts-nocheck
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { GroupsV2GroupV2 } from 'bungie-api-angular/lib/model/groupsV2GroupV2';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GroupsV2GroupV2 } from 'bungie-api-angular/lib/model/groupsV2GroupV2';
@Component({
  selector: 'dcd-clan-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clan-info.component.html',
  styleUrls: ['./clan-info.component.scss']
})
export class ClanInfoComponent implements OnChanges {
  @Input() clanDetail!: GroupsV2GroupV2;
  @Input() loading!: boolean;

  clanProgress: any;
  seasonProgress: any;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['clanDetail'] && this.clanDetail?.clanInfo) {
      // TODO Constant this

      this.clanProgress = this.clanDetail.clanInfo.d2ClanProgressions['584850370'];
      if (this.clanProgress?.level === this.clanProgress?.levelCap) {
        this.seasonProgress = 100;
      } else {
        this.seasonProgress = (this.clanProgress?.progressToNextLevel / this.clanProgress?.nextLevelAt) * 100;
      }
    }
  }
}
