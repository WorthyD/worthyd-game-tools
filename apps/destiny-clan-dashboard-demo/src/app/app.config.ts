import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { LocationToken, WindowToken, locationProvider, windowProvider } from '@dcd/shared/tokens';
import { IdbKeyValService } from '@dcd/shared/utils/storage';
import { ClanMembersService } from '@dcd/shared/data-access/clan-collections';
import { ApiKeyInterceptor } from '@dcd/shared/utils/api-key-interceptor';
//import { ClanProfileService } from '@destiny-clan-dashboard/data/clan/profiles/profile.service';
import { ClanProfileService } from '@dcd/shared/data-access/clan-collections';
import { ProfileRecentActivityWorkerService as ProfileRecentActivityWorkerServiceFakeSecond } from '@dcd/roster-recent-activity/data-access';
import { ProfileRecentActivityWorkerService as ProfileRecentActivityWorkerServiceFakeThird } from '@dcd/activity-modes/data-access';
import { ProfileRecentActivityWorkerService as ProfileRecentActivityWorkerServiceFakeFourth } from '@dcd/activities/data-access';
import { ProfileRecentActivityWorkerService as ProfileRecentActivityWorkerServiceFakeFifth } from '@dcd/dashboard/data-access';
import { ClanDatabase, ClanDbModule } from '@dcd/shared/clan-db';
import { providePlayerSidebar } from '@dcd/player-sidebar/data-access';
import { ClanBungieInfoService, ClanDetailsService } from '@dcd/shared/data-access/clan-collections';
import { getAppConfigProvider, AppConfigService } from '@dcd/shared/utils/app-config';
import { SealsModule } from '@dcd/shared/data-access/seals';
import { coreEffects, coreReducers, metaReducers } from '@dcd/shared/data-access/store';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { getMockProviders } from './mock-providers';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),

    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    providePlayerSidebar(),

    // Imported Providers
    importProvidersFrom(ClanDbModule, SealsModule),
    // NGRX Providers
    provideStore(coreReducers, { metaReducers }),
    provideEffects(coreEffects),
    {
      provide: ClanProfileService,
      useFactory: (canDB: any) => {
        return new ClanProfileService(canDB, '');
      },
      deps: [ClanDatabase]
    },
    {
      provide: ClanBungieInfoService,
      useFactory: (canDB: any) => {
        return new ClanBungieInfoService(canDB, '');
      },
      deps: [ClanDatabase]
    },

    { provide: LocationToken, useFactory: locationProvider },
    { provide: WindowToken, useFactory: windowProvider },

    getAppConfigProvider({
      apiKey: '',
      appVersion: '',
      production: true,
      useMocks: true,
      constants: {
        D2DASHBOARD_ACKNOWLEDGE_OFFLINE: 'D2DASHBOARD_ACKNOWLEDGE_OFFLINE',
        PROFILE_UPDATING_EXP_MINUTES: 180,
        MEMBER_RECENT_ACTIVITY_EXP_MINUTES: 360,
        CURRENT_SEALS_HASH: 616318467,
        LEGACY_SEALS_HASH: 1881970629
      }
    }),
    // Standard providers
    AppConfigService,
    IdbKeyValService,
    ClanMembersService,
    ClanDetailsService,

    // Mock Replacements
    getMockProviders()
  ]
};
