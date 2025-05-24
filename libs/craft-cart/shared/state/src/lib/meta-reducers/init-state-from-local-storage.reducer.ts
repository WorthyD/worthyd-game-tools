import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { LocalStorageService } from '@dcd/shared/utils/local-storage';

export function initStateFromLocalStorage<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  return function (state, action) {
    const newState = reducer(state, action);
    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      return { ...newState, ...LocalStorageService.loadInitialState() };
    }
    return newState;
  };
}
