import { ManifestService } from '@dcd/shared/data-access/manifest';
import { MockManifestService } from './mock-services/manifest.service';
import { ClanSearchService } from '@dcd/clan-search/data-access';
import { ClanSearchMockService } from './mock-services/clan-search.mock.service';
import { ClanDetailMockService } from './mock-services/clan-detail.mock.service';
import { ClanDetailService } from '@dcd/shared/clan-details/data-access';
import { ProfileWorkerMockService } from './mock-services/profile-worker.mock.service';
import { ProfileWorkerService } from '@dcd/shared/data-access/profile';
import { BungieInfoWorkerService } from '@dcd/shared/data-access/bungie-info';
import { BungieInfoWorkerMockService } from './mock-services/bungie-info-worker.mock.service';
import { ProfileRecentActivityWorkerMockService } from './mock-services/profile-recent-activity.mock.service';
import { ProfileRecentActivityWorkerService } from '@dcd/shared/data-access/member-activity';
import { ClanUpdaterMockService } from './mock-services/clan-updater.mock.service';
import { ClanUpdaterService } from 'libs/dcd/layout/src/lib/services/clan-updater.service';

export const getMockProviders = () => {
  return [
    // Mock Services
    { provide: ManifestService, useClass: MockManifestService },
    { provide: ClanSearchService, useClass: ClanSearchMockService },
    { provide: ClanDetailService, useClass: ClanDetailMockService },
    { provide: ClanUpdaterService, useClass: ClanUpdaterMockService }

    // Workers
    // { provide: ProfileWorkerService, useClass: ProfileWorkerMockService },
    // { provide: BungieInfoWorkerService, useClass: BungieInfoWorkerMockService },
    // { provide: ProfileRecentActivityWorkerService, useClass: ProfileRecentActivityWorkerMockService },
  ];
};
