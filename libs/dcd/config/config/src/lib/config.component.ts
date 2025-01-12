import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectAllClans, removeClan } from '@dcd/shared/data-access/store';
import { ClanDatabase } from '@dcd/shared/clan-db';
import { MatButtonModule } from '@angular/material/button';
import { ClanDetailComponent } from '@dcd/shared/clan-details/feature';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss'],
    imports: [ClanDetailComponent, MatButtonModule, CommonModule]
})
export class ConfigComponent {
  constructor(private store: Store, private db: ClanDatabase) {}

  clanConfigs$ = this.store.select(selectAllClans);

  async nuke() {
    window.localStorage.clear();

    const dbs = await window.indexedDB.databases();
    dbs.forEach((db) => {
      if (db.name === 'manifest') {
        window.indexedDB.deleteDatabase(db.name);
      }
    });
  }

  onDeleteClan(clanId: string) {
    this.store.dispatch(removeClan({ clanId: clanId }));
    this.db.purgeDatabase(clanId);
    /*
    window.localStorage.removeItem(`lastActivityUpdate-${x}`)
    window.localStorage.removeItem(`lastActivityAllUpdate-${x}`)
    window.localStorage.removeItem(`MANIFEST_PATH_KEY`)
    window.localStorage.removeItem(`MANIFEST_PATH_EXP_KEY`)
    */
  }
}
