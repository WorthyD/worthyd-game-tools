import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as CatalogActions from './catalog.actions';
import { Item } from '@crafting-cart/models';

export const CATALOG_FEATURE_KEY = 'catalog';

export interface CatalogState extends EntityState<Item> {
  selectedId?: string | number; // which Catalog record has been selected
  loaded: boolean; // has the Catalog list been loaded
  error?: string | null; // last known error (if any)
}

export interface CatalogPartialState {
  readonly [CATALOG_FEATURE_KEY]: CatalogState;
}

export const catalogAdapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialCatalogState: CatalogState = catalogAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const reducer = createReducer(
  initialCatalogState,
  on(CatalogActions.initCatalog, (state, { catalog }) => catalogAdapter.setAll(catalog, { ...state, loaded: true }))
);

export function catalogReducer(state: CatalogState | undefined, action: Action) {
  return reducer(state, action);
}
