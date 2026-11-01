import { inject } from '@angular/core';
import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { LocalStorageService } from '@worthyd/shared/utils/local-storage';

export function initStateFromLocalStorage<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  const localStorageService = inject(LocalStorageService);
  return function (state, action) {
    const newState = reducer(state, action);
    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      return { ...newState, ...localStorageService.loadInitialState() };
    }
    return newState;
  };
}
