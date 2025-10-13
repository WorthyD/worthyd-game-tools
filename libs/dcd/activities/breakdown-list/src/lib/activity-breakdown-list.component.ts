//@ts-nocheck
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CollectionDefinition, MetricDefinition, RecordDefinition } from '@dcd/shared/models';
import { ActivitiesService } from '@dcd/activities/data-access';
import { Observable, map, of, startWith, tap } from 'rxjs';
import { ClanMemberProfile } from '@dcd/shared/models';
import { InCollectionsTotalPipe, MetricTotalPipe, RecordTotalPipe } from '@dcd/shared/utils/pipes';

type ActivityBreakDownItem =
  | MetricActivityBreakDownItem
  | CollectionActivityBreakDownItem
  | RecordActivityBreakDownItem;

interface MetricActivityBreakDownItem {
  type: 'metric';
  definition: MetricDefinition;
  total: number;
}

interface CollectionActivityBreakDownItem {
  type: 'collection';
  definition: CollectionDefinition;
  total: number;
}

interface RecordActivityBreakDownItem {
  type: 'record';
  definition: RecordDefinition;
  total: number;
}

@Component({
    selector: 'app-activity-breakdown-list',
    templateUrl: './activity-breakdown-list.component.html',
    styleUrls: ['./activity-breakdown-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ActivityBreakdownListComponent implements OnChanges {
  @Input() metricDefinitions: MetricDefinition[];
  @Input() collectionDefinitions: CollectionDefinition[];
  @Input() recordDefinitions: RecordDefinition[];
  isLoading = false;
  metricPipe = new MetricTotalPipe();
  inCollectionPipe = new InCollectionsTotalPipe();
  recordPipe = new RecordTotalPipe();
  activityInfo$: Observable<ActivityBreakDownItem[]> = of([]);

  constructor(private activitiesService: ActivitiesService) {}
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      simpleChanges['metricDefinitions'] ||
      simpleChanges['collectionDefinitions'] ||
      simpleChanges['recordDefinitions']
    ) {
      this.isLoading = true;
      this.activityInfo$ = this.activitiesService
        .getProfiles(
          this.metricDefinitions.map((md) => md.hash),
          this.collectionDefinitions.map((md) => md.hash),
          this.recordDefinitions.map((md) => md.hash)
        )
        .pipe(
          map((clanProfiles) => {
            const profiles = clanProfiles.map((cp) => cp.profile);
            const items = [];
            this.metricDefinitions.forEach((md) => {
              items.push({
                type: 'metric',
                definition: md,
                total: this.metricPipe.transform(profiles, md.hash as number)
              } as MetricActivityBreakDownItem);
            });

            this.collectionDefinitions.forEach((cd) => {
              items.push({
                type: 'collection',
                definition: cd,
                total: this.inCollectionPipe.transform(profiles, cd.hash as number)
                // total: this.metricPipe.transform(profiles, md.hash as number)
              } as CollectionActivityBreakDownItem);
            });
            this.recordDefinitions.forEach((rd) => {
              items.push({
                type: 'record',
                definition: rd,
                total: this.recordPipe.transform(profiles, rd)
              } as RecordActivityBreakDownItem);
            });

            return items;
          }),
          tap((x) => {
            this.isLoading = false;
          })
        );
    }
  }
}
