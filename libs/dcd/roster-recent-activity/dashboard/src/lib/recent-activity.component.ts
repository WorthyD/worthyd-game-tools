import { ChangeDetectionStrategy, Component } from '@angular/core';
//import { DataSource, Exporter, Filterer, Sorter, Viewer } from '@destiny-clan-dashboard/components';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
//import { RecentActivityService } from '../data-access/recent-activity.service';
import { RecentActivityService } from '@dcd/roster-recent-activity/data-access';

import { ProfileRecentActivity } from '@dcd/roster-recent-activity/models';

import {
  CLAN_ROSTER_EXPORTER_METADATA,
  RECENT_ACTIVITY_FILTERER_METADATA,
  RECENT_ACTIVITY_SORTER_METADATA,
  RECENT_ACTIVITY_VIEWER_METADATA
} from './recent-activity-metadata';
import { DataSource, Exporter, Filterer, Sorter, Viewer } from '@dcd/shared/data';
import { BungieDateTimePipe, PlaytimePipe } from '@dcd/shared/utils/pipes';

interface RosterActivityResources {
  viewer: Viewer;
  filterer: Filterer;
  //grouper: Grouper;
  exporter: Exporter;
  sorter: Sorter;
  dataSource: DataSource;
}

@Component({
  selector: 'app-recent-activity-viewer',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class RecentActivityComponent {
  constructor(
    private recentActivityService: RecentActivityService,
    private playtimePipe: PlaytimePipe,
    private bungieDateTimePipe: BungieDateTimePipe
  ) {}

  clanProfileActivity$ = this.recentActivityService.activeClanActivity$;
  activityViewer = new Viewer(
    {
      metadata: RECENT_ACTIVITY_VIEWER_METADATA,
      contextProvider: this.createViewContextProvider()
    },
    'D2Dashboard_Roster_Activity_Table_Viewer'
  );
  activityFilterer = new Filterer({ metadata: RECENT_ACTIVITY_FILTERER_METADATA });
  activitySorter = new Sorter({ metadata: RECENT_ACTIVITY_SORTER_METADATA });
  activityExporter = new Exporter({
    metadata: CLAN_ROSTER_EXPORTER_METADATA,
    contextProvider: this.createViewContextProvider()
  });
  isLoading = true;

  rosterRecentActivityInfo$: Observable<RosterActivityResources> = combineLatest([this.clanProfileActivity$]).pipe(
    map(([clanProfiles]) => {
      return {
        dataSource: new DataSource<ProfileRecentActivity>({ data: clanProfiles }),
        viewer: this.activityViewer,
        filterer: this.activityFilterer,
        exporter: this.activityExporter,
        sorter: this.activitySorter
      };
    }),
    tap((x) => (this.isLoading = false))
  );
  createViewContextProvider() {
    return of((item: ProfileRecentActivity) => ({
      item,
      playTimePipe: this.playtimePipe,
      dateTimePipe: this.bungieDateTimePipe
      // dateTimePipe: this.bungieDateTimePipe
    }));
  }
}
