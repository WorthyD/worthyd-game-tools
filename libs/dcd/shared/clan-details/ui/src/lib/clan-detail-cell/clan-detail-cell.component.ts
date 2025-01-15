import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsV2GroupV2 } from 'bungie-api-angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BungieDatePipe } from '@dcd/shared/utils/pipes';

@Component({
  selector: 'dcd-clan-detail-cell',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    BungieDatePipe,
    MatIconModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './clan-detail-cell.component.html',
  styleUrls: ['./clan-detail-cell.component.scss']
})
export class ClanDetailCellComponent {
  @Input() clanDetail: GroupsV2GroupV2 | undefined | null = undefined;
  @Input() loading: boolean = false;
  @Input() showAdd: boolean = false;
  @Input() showReset: boolean = false;
  @Output() removeClan = new EventEmitter<string>();
  @Output() addClan = new EventEmitter<GroupsV2GroupV2 | undefined | null>();
  @Output() resetClan = new EventEmitter<GroupsV2GroupV2 | undefined | null>();
}
