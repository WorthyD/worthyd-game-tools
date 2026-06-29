import { Injectable } from '@angular/core';
// import {
//   DestinyDefinitionsSeasonsDestinySeasonDefinition,
//   DestinyDefinitionsSeasonsDestinySeasonPassDefinition
// } from 'bungie-api-angular';
import { DestinyDefinitionsSeasonsDestinySeasonDefinition } from 'bungie-api-angular';
import { DestinyDefinitionsSeasonsDestinySeasonPassDefinition } from 'bungie-api-angular';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  currentSeason: DestinyDefinitionsSeasonsDestinySeasonDefinition | undefined = undefined;
  currentSeasonProgress: DestinyDefinitionsSeasonsDestinySeasonPassDefinition | undefined = undefined;

  lastSeason: DestinyDefinitionsSeasonsDestinySeasonDefinition | undefined = undefined;
  lastSeasonProgress: DestinyDefinitionsSeasonsDestinySeasonPassDefinition | undefined = undefined;

  allSeasons: DestinyDefinitionsSeasonsDestinySeasonDefinition[] = [];
  constructor() {}

  init(
    seasons: { [key: string]: DestinyDefinitionsSeasonsDestinySeasonDefinition },
    seasonPasses: { [key: string]: DestinyDefinitionsSeasonsDestinySeasonPassDefinition }
  ) {
    const now = new Date();
    const currentSeasonKey = Object.keys(seasons).find((seasonKey) => {
      const season = seasons[seasonKey];
      const hasEndAndNotPassed = !season.endDate || now < new Date(season.endDate);
      return season.startDate && new Date(season.startDate) < now && hasEndAndNotPassed;
    });

    this.allSeasons = Object.keys(seasons).map((seasonKey) => {
      return seasons[seasonKey];
    });
    if (currentSeasonKey) {
      this.currentSeason = seasons[currentSeasonKey];
      this.currentSeasonProgress = seasonPasses[this.currentSeason.seasonPassHash!];
    }

    this.lastSeason = this.getPreviousSeason();
    this.lastSeasonProgress = seasonPasses[this.lastSeason!.seasonPassHash!];
  }

  getSeasonProgressionHashes(): number[] {
    if (this.currentSeasonProgress?.prestigeProgressionHash && this.currentSeasonProgress?.rewardProgressionHash) {
      return [this.currentSeasonProgress?.prestigeProgressionHash, this.currentSeasonProgress?.rewardProgressionHash];
    }
    return [];
  }

  getPreviousSeason() {
    const currentSeasonNumber = this.currentSeason?.seasonNumber || 0;
    return this.allSeasons.find((season) => {
      return season.seasonNumber && season.seasonNumber === currentSeasonNumber - 1;
    });
  }
}
