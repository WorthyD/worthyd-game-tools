import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as CatalogActions from './catalog.actions';
import { CatalogEffects } from './catalog.effects';
import { CatalogFacade } from './catalog.facade';
import { CatalogEntity } from './catalog.models';
import { CATALOG_FEATURE_KEY, CatalogState, initialCatalogState, catalogReducer } from './catalog.reducer';
import * as CatalogSelectors from './catalog.selectors';

interface TestSchema {
  catalog: CatalogState;
}

describe('CatalogFacade', () => {
  let facade: CatalogFacade;
  let store: Store<TestSchema>;
  const createCatalogEntity = (id: string, name = ''): CatalogEntity => ({
    id,
    name: name || `name-${id}`
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(CATALOG_FEATURE_KEY, catalogReducer),
          EffectsModule.forFeature([CatalogEffects])
        ],
        providers: [CatalogFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(CatalogFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allCatalog$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allCatalog$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadCatalogSuccess` to manually update list
     */
    it('allCatalog$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allCatalog$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        CatalogActions.loadCatalogSuccess({
          catalog: [createCatalogEntity('AAA'), createCatalogEntity('BBB')]
        })
      );

      list = await readFirst(facade.allCatalog$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
