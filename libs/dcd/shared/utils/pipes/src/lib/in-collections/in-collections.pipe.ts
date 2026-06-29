import { Pipe, PipeTransform } from '@angular/core';
import { hasItem } from './has-item';
import { DestinyComponentsCollectiblesDestinyCollectibleComponent } from 'bungie-api-angular';

@Pipe({
  name: 'inCollections',
  standalone: true
})
export class InCollectionsPipe implements PipeTransform {
  transform(value: DestinyComponentsCollectiblesDestinyCollectibleComponent): unknown {
    return hasItem(value);
  }
}
