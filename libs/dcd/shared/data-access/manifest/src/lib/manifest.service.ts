import { Injectable } from '@angular/core';
//import { ActivityDefinitionService } from '@core/definition-services/activity-definition.service';
//import { ActivityModeDefinitionService } from '@core/definition-services/activity-mode-definition.service';
import {  DefinitionService } from '@dcd/shared/data-access/definitions';
//import { MilestoneDefinitionService } from '@core/definition-services/milestone-definition.service';
// import { RecordDefinitionService } from '@core/definition-services/record-definition.service';
import { ManifestLoaderService } from './manifest-loader.service';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {
  constructor(private loader: ManifestLoaderService, private definitionService: DefinitionService) {}
  timerName = 'loadManifest';

  loadManifest() {
    console.time(this.timerName);
    const tables = [
      //'DestinyChecklistDefinition',
      //'DestinyObjectiveDefinition',
      //'DestinyStatDefinition',
      //'DestinyVendorDefinition',
      //'DestinyInventoryItemDefinition',
      //'DestinyClassDefinition',
      //'DestinySandboxPerkDefinition',
      //'DestinyEnergyTypeDefinition',
      'DestinyCollectibleDefinition',
      'DestinyMetricDefinition',
      'DestinyPresentationNodeDefinition',
      'DestinyRecordDefinition',
      'DestinySeasonDefinition',
      'DestinySeasonPassDefinition',
      'DestinyMilestoneDefinition',
      'DestinyActivityDefinition',
      'DestinyActivityModeDefinition'
      //'DestinyPlaceDefinition',
      //'DestinyFactionDefinition'
    ];
    return this.loader.loadManifestData('en', tables).pipe(
      map((x) => {









        if (x && x.data) {
          this.definitionService.initializeCache(x.data);
        }
        console.timeEnd(this.timerName);
        return true;
      }),
      catchError((error) => {

        throw error;
      })
    );
  }
}
