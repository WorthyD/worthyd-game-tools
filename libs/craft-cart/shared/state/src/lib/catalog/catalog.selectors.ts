import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CATALOG_FEATURE_KEY, CatalogState, catalogAdapter } from './catalog.reducer';

// Lookup the 'Catalog' feature state managed by NgRx
export const selectCatalogState = createFeatureSelector<CatalogState>(CATALOG_FEATURE_KEY);

const { selectAll, selectEntities } = catalogAdapter.getSelectors();

export const selectCatalogLoaded = createSelector(selectCatalogState, (state: CatalogState) => state.loaded);

export const selectCatalogError = createSelector(selectCatalogState, (state: CatalogState) => state.error);

export const selectAllCatalog = createSelector(selectCatalogState, (state: CatalogState) => selectAll(state));

export const selectCatalogEntities = createSelector(selectCatalogState, (state: CatalogState) => selectEntities(state));

export const selectSelectedId = createSelector(selectCatalogState, (state: CatalogState) => state.selectedId);

export const selectEntity = createSelector(selectCatalogEntities, selectSelectedId, (entities, selectedId) =>
  selectedId ? entities[selectedId] : undefined
);

export const selectCatalogItems = (itemIds: string[]) =>
  createSelector(selectCatalogEntities, (entities) => {
    return itemIds.map((id) => entities[id]).filter((item) => !!item);
  });
