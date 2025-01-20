import { createAction, props } from '@ngrx/store';
import { CatalogEntity } from './catalog.models';

export const initCatalog = createAction('[Catalog Page] Init');

export const loadCatalogSuccess = createAction(
  '[Catalog/API] Load Catalog Success',
  props<{ catalog: CatalogEntity[] }>()
);

export const loadCatalogFailure = createAction('[Catalog/API] Load Catalog Failure', props<{ error: any }>());
