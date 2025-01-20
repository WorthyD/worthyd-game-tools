import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as CatalogActions from './catalog.actions';
import * as CatalogFeature from './catalog.reducer';

@Injectable()
export class CatalogEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.initCatalog),
      switchMap(() => of(CatalogActions.loadCatalogSuccess({ catalog: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(CatalogActions.loadCatalogFailure({ error }));
      })
    )
  );
}
