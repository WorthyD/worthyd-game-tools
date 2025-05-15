import { Action } from '@ngrx/store';

import * as CatalogActions from './catalog.actions';
import { CatalogEntity } from './catalog.models';
import { CatalogState, initialCatalogState, catalogReducer } from './catalog.reducer';

describe('Catalog Reducer', () => {
  const createCatalogEntity = (id: string, name = ''): CatalogEntity => ({
    id,
    name: name || `name-${id}`
  });

  describe('valid Catalog actions', () => {
    it('loadCatalogSuccess should return the list of known Catalog', () => {
      const catalog = [createCatalogEntity('PRODUCT-AAA'), createCatalogEntity('PRODUCT-zzz')];
      const action = CatalogActions.loadCatalogSuccess({ catalog });

      const result: CatalogState = catalogReducer(initialCatalogState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = catalogReducer(initialCatalogState, action);

      expect(result).toBe(initialCatalogState);
    });
  });
});
