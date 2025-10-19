import { Inject, Injectable } from '@angular/core';
//import { ActivityDefinitionService } from '@core/definition-services/activity-definition.service';
//import { ActivityModeDefinitionService } from '@core/definition-services/activity-mode-definition.service';
import { DefinitionService } from '@dcd/shared/data-access/definitions';
//import { MilestoneDefinitionService } from '@core/definition-services/milestone-definition.service';
// import { RecordDefinitionService } from '@core/definition-services/record-definition.service';
import { catchError, from, map } from 'rxjs';
import { WindowToken } from '@dcd/shared/tokens';
import { IdbKeyValService } from '@dcd/shared/utils/storage';

@Injectable()
export class MockManifestService {
  constructor(
    private definitionService: DefinitionService,
    private db: IdbKeyValService,
    @Inject(WindowToken) private window: Window
  ) {
    console.log('MockManifestService instantiated');
  }

  pruneTables(obj: any, keys: any) {
    if (!keys.length) {
      return obj;
    }

    return keys.reduce((acc: any, key: any) => {
      return {
        ...acc,
        [key]: obj[key]
      };
    }, {});
  }

  loadManifest() {
    const tableNames = [
      'DestinyCollectibleDefinition',
      'DestinyMetricDefinition',
      'DestinyPresentationNodeDefinition',
      'DestinyRecordDefinition',
      'DestinySeasonDefinition',
      'DestinySeasonPassDefinition',
      'DestinyMilestoneDefinition',
      'DestinyActivityDefinition',
      'DestinyActivityModeDefinition'
    ];
    return from(this.db.get<any>('manifest')).pipe(
      map((cachedValue) => {
        const versionKey = `demo-v1`;

        if (cachedValue && cachedValue.length > 0 && cachedValue.find((x: any) => x.id === versionKey)) {
          return cachedValue.find((x: any) => x.id === versionKey);
        }

        return this.window.fetch(`./assets/manifest.json`).then((x) => {
          return x.json().then((y) => {
            const prunedTables = this.pruneTables(y, tableNames);

            const dbObject = { id: versionKey, data: prunedTables };
            this.db.set('manifest', [dbObject]);

            return dbObject;
          });
        });
      })
    );
  }
}
