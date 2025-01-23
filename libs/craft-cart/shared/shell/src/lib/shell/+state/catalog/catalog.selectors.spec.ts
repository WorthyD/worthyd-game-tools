import { CatalogEntity } from './catalog.models';
import { catalogAdapter, CatalogPartialState, initialCatalogState } from './catalog.reducer';
import * as CatalogSelectors from './catalog.selectors';

describe('Catalog Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getCatalogId = (it: CatalogEntity) => it.id;
  const createCatalogEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    }) as CatalogEntity;

  let state: CatalogPartialState;

  beforeEach(() => {
    state = {
      catalog: catalogAdapter.setAll(
        [createCatalogEntity('PRODUCT-AAA'), createCatalogEntity('PRODUCT-BBB'), createCatalogEntity('PRODUCT-CCC')],
        {
          ...initialCatalogState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('Catalog Selectors', () => {
    it('selectAllCatalog() should return the list of Catalog', () => {
      const results = CatalogSelectors.selectAllCatalog(state);
      const selId = getCatalogId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = CatalogSelectors.selectEntity(state) as CatalogEntity;
      const selId = getCatalogId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectCatalogLoaded() should return the current "loaded" status', () => {
      const result = CatalogSelectors.selectCatalogLoaded(state);

      expect(result).toBe(true);
    });

    it('selectCatalogError() should return the current "error" state', () => {
      const result = CatalogSelectors.selectCatalogError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
