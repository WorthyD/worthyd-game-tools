import { Item } from '@crafting-cart/shared/models';
import { createAction, props } from '@ngrx/store';
// import { CatalogEntity } from './catalog.models';

export const initCatalog = createAction('[Catalog Page] Init', props<{ catalog: Item[] }>());
