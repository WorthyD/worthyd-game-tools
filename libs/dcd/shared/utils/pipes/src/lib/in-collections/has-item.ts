
import { DestinyComponentsCollectiblesDestinyCollectibleComponent } from 'bungie-api-angular';

export function hasItem(value: DestinyComponentsCollectiblesDestinyCollectibleComponent) {
  if (value === undefined || value.state === undefined) {
    return false;
  }
  // tslint:disable-next-line:no-bitwise
  return (value?.state & 1) === 0;
}
