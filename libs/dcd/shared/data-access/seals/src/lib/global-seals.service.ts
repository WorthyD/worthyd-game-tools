import { Injectable } from '@angular/core';
//import { AppConfig } from '@core/config/app-config';
import { AppConfigService } from '@dcd/shared/utils/app-config';
import { DefinitionService } from '@dcd/shared/data-access/definitions';
import { DestinyDefinitionsPresentationDestinyPresentationNodeDefinition } from 'bungie-api-angular/lib/model/destinyDefinitionsPresentationDestinyPresentationNodeDefinition';

@Injectable()
export class GlobalSealsService {
  currentSealNodes: DestinyDefinitionsPresentationDestinyPresentationNodeDefinition;
  legacySealNodes: DestinyDefinitionsPresentationDestinyPresentationNodeDefinition;
  allNodes: any;
  allNodesWLegacy: any;
  sealNodes: DestinyDefinitionsPresentationDestinyPresentationNodeDefinition[];
  sealNodesWLegacy: DestinyDefinitionsPresentationDestinyPresentationNodeDefinition[];
  constructor(
    private appConfig: AppConfigService,
    private definitionService: DefinitionService
  ) {
    this.currentSealNodes =
      this.definitionService.presentationDefinition[this.appConfig.config.constants.CURRENT_SEALS_HASH];
    this.legacySealNodes =
      this.definitionService.presentationDefinition[this.appConfig.config.constants.LEGACY_SEALS_HASH];
    this.allNodes = this.getNodes(this.currentSealNodes);

    this.allNodesWLegacy = this.getNodes(this.currentSealNodes).concat(this.getNodes(this.legacySealNodes));
    this.sealNodes = this.getDefinitionsByHash(this.allNodes);
    this.sealNodesWLegacy = this.getDefinitionsByHash(this.allNodesWLegacy);
  }

  //allNodes = this.getNodes(this.currentSealNodes).concat(this.getNodes(this.legacySealNode));

  private getNodes(node: any) {
    return node.children.presentationNodes.map((x: any) => x.presentationNodeHash);
  }

  private getDefinitionsByHash(allNodes: any[]) {
    return allNodes.map((h) => {
      return this.definitionService.presentationDefinition[h];
    });
  }
}
