import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSource, Exporter, Filterer, Sorter, Viewer } from '@dcd/shared/data';
import { combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { SealsService } from '@dcd/seals/data-access';
import {SealClanMember} from '@dcd/seals/models';
import {
  //SEAL_DETAILS_EXPORTER_METADATA,
  SEAL_DETAILS_FILTERER_METADATA,
  SEAL_DETAILS_SORTER_METADATA,
  SEAL_DETAILS_VIEWER_METADATA
} from './seal-details-metadata';

interface SealDetailsResources {
  loading: Observable<boolean>;
  viewer: Viewer;
  filterer: Filterer;
  //grouper: Grouper;
  // exporter: Exporter;
  sorter: Sorter;
  dataSource: DataSource;
}

@Component({
    selector: 'app-seal-details',
    templateUrl: './seal-details.component.html',
    styleUrls: ['./seal-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SealDetailsComponent {
  constructor(private route: ActivatedRoute, private sealsService: SealsService) {}

  sealHash$ = this.route.paramMap.pipe(
    map((params) => {
      return this.sealsService.sealNodes.find((x) => x.hash === +params.get('hash')!);
    })
  );

  sealDetails$ = this.route.paramMap.pipe(
    switchMap((params) => {
      return this.sealsService.getSealDetails$(params.get('hash'));
    })
  );

  isLoading = true;
  sealDetailsViewer = new Viewer(
    {
      metadata: SEAL_DETAILS_VIEWER_METADATA,
      contextProvider: this.createViewContextProvider()
    },
    'D2Dashboard_Seals_Details_ViewerV2'
  );
  sealDetailsFilterer = new Filterer({ metadata: SEAL_DETAILS_FILTERER_METADATA });
  sealDetailsSorter = new Sorter({ metadata: SEAL_DETAILS_SORTER_METADATA });
  // sealDetailsExporter = new Exporter({
  //   metadata: SEAL_DETAILS_EXPORTER_METADATA,
  //   contextProvider: this.createViewContextProvider()
  // });
  createViewContextProvider() {
    return of((item: SealClanMember) => ({
      item
      // dateTimePipe: this.bungieDateTimePipe
    }));
  }

  sealDetailsInfo$: Observable<SealDetailsResources> = combineLatest([this.sealDetails$]).pipe(
    map(([sealDetails]) => {
      return {
        loading: of(false),
        dataSource: new DataSource<SealClanMember>({ data: sealDetails }),
        viewer: this.sealDetailsViewer,
        filterer: this.sealDetailsFilterer,
        //   exporter: this.sealDetailsExporter,
        sorter: this.sealDetailsSorter
      };
    }),
    tap((x) => (this.isLoading = false))
    //filter((ds) => !!ds)
  );
}
