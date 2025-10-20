import { ManifestService } from '@dcd/shared/data-access/manifest';
import { MockManifestService } from './mock-services/manifest.service';
import { ClanSearchService } from '@dcd/clan-search/data-access';
import { ClanSearchMockService } from './mock-services/clan-search.mock.service';
import { ClanDetailMockService } from './mock-services/clan-detail.mock.service';
import { ClanDetailService } from '@dcd/shared/clan-details/data-access';
import { ClanUpdaterMockService } from './mock-services/clan-updater.mock.service';
import { ClanUpdaterService } from 'libs/dcd/layout/src/lib/services/clan-updater.service';
import { ClansDetailsActivitiesMockService } from './mock-services/clans-details-activities.mock.service';
import { ClansDetailsActivitiesService } from '@dcd/dashboard/data-access';

export const getMockProviders = () => {
  return [
    // Mock Services
    { provide: ManifestService, useClass: MockManifestService },
    { provide: ClanSearchService, useClass: ClanSearchMockService },
    { provide: ClanDetailService, useClass: ClanDetailMockService },
    { provide: ClanUpdaterService, useClass: ClanUpdaterMockService },
    { provide: ClansDetailsActivitiesService, useClass: ClansDetailsActivitiesMockService },

    // Workers
    // { provide: ProfileWorkerService, useClass: ProfileWorkerMockService },
    // { provide: BungieInfoWorkerService, useClass: BungieInfoWorkerMockService },
    // { provide: ProfileRecentActivityWorkerService, useClass: ProfileRecentActivityWorkerMockService },
  ];
};
