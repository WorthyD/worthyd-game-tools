import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { ClanUpdaterService } from '../services/clan-updater.service';
import { AppConfigService } from '@dcd/shared/utils/app-config';
import { getAllNotifications, initializeClanItems } from '@dcd/shared/data-access/store';
import { providePlayerSidebar, PlayerSidebarStore } from '@dcd/player-sidebar/data-access';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.scss'],
    standalone: false
})
export class WrapperComponent implements OnInit {
  readonly #playerSidebarStore = inject(PlayerSidebarStore);
  @ViewChild('playersidenav') playerSideNav!: MatSidenav;

  constructor(
    private clanUpdaterService: ClanUpdaterService,
    private store: Store,
    private appConfig: AppConfigService
  ) {}
  year = new Date().getFullYear();
  loading: boolean = false;
  showSandbox = !this.appConfig.config.production;
  footerOpen = false;

  notifications$ = this.store.select(getAllNotifications);
  versionNumber = this.appConfig.config.appVersion;

  selectedProfile = this.#playerSidebarStore.selectedProfile;
  selectedLoading = this.#playerSidebarStore.profileLoading;

  ngOnInit(): void {
    this.loading = true;
    this.clanUpdaterService
      .update()
      .pipe(take(1))
      .subscribe((x) => (this.loading = false));

    this.store.dispatch(initializeClanItems());
  //  console.log('selected Profile', this.#playerSidebarStore.selectedProfile().loaded())
  }
  closeSidebar() {
    this.playerSideNav.close();
    this.#playerSidebarStore.clear();
  }
}
