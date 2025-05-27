import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { LocalStorageService } from '@worthyd/shared/utils/local-storage';
import { selectCartState } from './cart.selectors';
import { addItemToCart, deleteItemFromCart, emptyCart, removeItemsFromCart } from './cart.actions';
import { tap } from 'rxjs';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private localStorageService = inject(LocalStorageService);

  persistCart$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(addItemToCart, deleteItemFromCart, emptyCart, removeItemsFromCart),
        concatLatestFrom(() => this.store.select(selectCartState)),
        tap(([, cartState]) => this.localStorageService.setItem('cart', cartState))
      );
    },
    { dispatch: false }
  );
}
