import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BungieInfo } from '@dcd/shared/models';
import { BungieDatePipe, DateAgoPipe } from '@dcd/shared/utils/pipes';

@Component({
  selector: 'lib-bungie-info',
  standalone: true,
  imports: [NgIf, NgFor, MatCardModule, MatListModule, MatIconModule, BungieDatePipe, DateAgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bungie-info.component.html',
  styleUrls: ['./bungie-info.component.scss']
})
export class BungieInfoComponent {
  _bungieInfo: BungieInfo = {};
  @Input()
  get bungieInfo(): BungieInfo {
    return this._bungieInfo;
  }
  set bungieInfo(value) {
    this._bungieInfo = value;
    this.applyLinks();
  }

  @Input()
  isLoading: boolean = false;

  linkedAccounts: { icon: string; name: string; description: string }[] = [];
  constructor() {}

  // ngOnInit(): void {}

  applyLinks() {
    if (!this._bungieInfo) {
      return;
    }
    const tempLinkedAccounts = [];
    if (this.bungieInfo.steamDisplayName) {
      tempLinkedAccounts.push({
        icon: 'steam',
        name: this.bungieInfo.steamDisplayName,
        description: 'Steam'
      });
    }
    if (this.bungieInfo.xboxDisplayName) {
      tempLinkedAccounts.push({
        icon: 'xbox',
        name: this.bungieInfo.xboxDisplayName,
        description: 'Xbox Live'
      });
    }
    if (this.bungieInfo.psnDisplayName) {
      tempLinkedAccounts.push({
        icon: 'playstation',
        name: this.bungieInfo.psnDisplayName,
        description: 'PlayStation'
      });
    }
    if (this.bungieInfo.stadiaDisplayName) {
      tempLinkedAccounts.push({
        icon: 'stadia',
        name: this.bungieInfo.stadiaDisplayName,
        description: 'Stadia'
      });
    }

    if (this.bungieInfo.egsDisplayName) {
      tempLinkedAccounts.push({
        icon: 'epic',
        name: this.bungieInfo.egsDisplayName,
        description: 'Epic'
      });
    }

    if (this.bungieInfo.twitchDisplayName) {
      tempLinkedAccounts.push({
        icon: 'twitch',
        name: this.bungieInfo.twitchDisplayName,
        description: 'Twitch'
      });
    }

    this.linkedAccounts = tempLinkedAccounts;
  }
}
