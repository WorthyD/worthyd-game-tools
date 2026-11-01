import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as CatalogActions from './catalog.actions';
import { CatalogEffects } from './catalog.effects';

describe('CatalogEffects', () => {
  let actions: Observable<Action>;
  let effects: CatalogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [CatalogEffects, provideMockActions(() => actions), provideMockStore()]
    });

    effects = TestBed.inject(CatalogEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: CatalogActions.initCatalog() });

      const expected = hot('-a-|', { a: CatalogActions.loadCatalogSuccess({ catalog: [] }) });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
