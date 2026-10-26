---
description: NgRx 21 here — classic Store + facades + entity adapters (Craft Cart, DCD), SignalStore (player-sidebar), effects, testing
globs: ["**/*.actions.ts", "**/*.reducer.ts", "**/*.effects.ts", "**/*.selectors.ts", "**/*.facade.ts", "**/*.state.ts", "**/*.feature.ts", "**/*store.ts", "**/*.store.ts", "**/data-access/**", "**/state/**", "**/meta-reducers/**"]
---

# NgRx

Installed: **NgRx 21** — `@ngrx/store`, `effects`, `entity`, `router-store`, `store-devtools`,
`operators`, `signals`, `component-store`; `@ngrx/eslint-plugin` is installed (rules not yet on).

## What this repo uses

| Where | Pattern |
|---|---|
| `libs/craft-cart/shared/state` (`@crafting-cart/state`) | Classic Store per feature folder: `<f>.actions.ts`, `<f>.reducer.ts` (entity adapter), `<f>.selectors.ts`, `<f>.state.ts`, `<f>.effects.ts` (class), `<f>.facade.ts`; meta-reducer hydrates from local storage |
| `@dcd/shared/data-access/store` and DCD `data-access` libs | Classic Store (e.g. manifest loading dispatched from the app root) |
| `libs/dcd/player-sidebar/data-access` | `@ngrx/signals` **SignalStore** (`PlayerSidebarStore`) |

**Rules:**

1. Extend a feature in the pattern it already uses. Don't mix Store and SignalStore within one
   feature, and don't migrate between them unless asked.
2. **Craft Cart components talk to state through facades** (`CartFacade`, `CatalogFacade`), not
   `Store` directly. Add methods/selectors to the facade when you add actions/selectors.
3. New, self-contained feature state → **SignalStore**. Cross-feature, event-driven state in an
   area that already uses Store → classic Store.
4. Plain `signal()` in a component is fine for trivial UI state.

## Classic Store

New action files: prefer `createActionGroup`. Existing files use `createAction` with a
`'[Cart] - Add Item To Cart'` style — keep that style when adding to them.

```ts
export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add Item': props<{ itemId: string; quantity: number }>(),
    'Empty': emptyProps()
  }
});
```

Reducers with `@ngrx/entity`:

```ts
export const cartAdapter = createEntityAdapter<CartEntity>({ selectId: (c) => c.itemId });
export const initialCartState: CartState = cartAdapter.getInitialState({});

const reducer = createReducer(
  initialCartState,
  on(CartActions.addItem, (state, { itemId, quantity }) =>
    cartAdapter.upsertOne({ itemId, quantity: (state.entities[itemId]?.quantity ?? 0) + quantity }, state)
  ),
  on(CartActions.empty, () => initialCartState)
);
```

- Actions are **events** ("Item Added"), one source per group; don't dispatch the same action from
  unrelated places.
- Reducers: pure, immutable, synchronous. Use adapter methods (`addOne`, `upsertOne`,
  `removeOne`, `setAll`) instead of hand-spreading entity maps.
- Selectors derive everything; never store derived data. Build on
  `createFeatureSelector` + `adapter.getSelectors()` as the existing files do (or `createFeature`
  for brand-new features).
- Effects: the repo uses **class-based effects with `inject()`** fields — follow that:

  ```ts
  @Injectable()
  export class CatalogEffects {
    private readonly actions$ = inject(Actions);
    private readonly api = inject(CatalogApi);

    load$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CatalogActions.opened),
        switchMap(() =>
          this.api.getAll().pipe(
            map((items) => CatalogActions.loadSuccess({ items })),
            catchError((error) => of(CatalogActions.loadFailure({ error: String(error) })))
          )
        )
      )
    );
  }
  ```

  - `catchError` **inside** the inner observable.
  - Choose the operator on purpose: `switchMap` (latest read), `concatMap` (ordered writes),
    `mergeMap` (parallel), `exhaustMap` (ignore while busy).
  - `concatLatestFrom` (from `@ngrx/operators`) to read state; `{ dispatch: false }` for
    side-effect-only effects (e.g. persisting to local storage).
- Register with standalone providers in the app/shell providers: `provideStore()`,
  `provideState(key, reducer)`, `provideEffects(Effects)`, `provideStoreDevtools()` (dev only).
- Components: `store.selectSignal(selector)` / `toSignal(facade.x$)` in new code; the `async` pipe
  is fine in existing templates.

## SignalStore

Follow `PlayerSidebarStore`:

```ts
export const ThingStore = signalStore(
  { providedIn: 'root' },                  // or provide on a route/component for scoped state
  withState(initialState),
  withComputed(({ items, filter }) => ({
    visible: computed(() => items().filter(matches(filter())))
  })),
  withMethods((store, api = inject(ThingApi)) => ({
    async load(id: string) {
      patchState(store, { loading: true });
      const items = await api.get(id);
      patchState(store, { items, loading: false });
    },
    reset() { patchState(store, initialState); }
  })),
  withHooks({ onInit(store) { /* optional */ } })
);
export type ThingStore = InstanceType<typeof ThingStore>;
```

- Update state only through `patchState` inside store methods (state is protected by default).
- `patchState` keys must exist on the state type — don't patch unknown properties.
- RxJS flows: `rxMethod` (from `@ngrx/signals/rxjs-interop`) with `tapResponse` (from
  `@ngrx/operators`) so errors don't kill the stream.
- Collections: `withEntities<T>()` + `addEntity`, `setAllEntities`, `updateEntity`,
  `removeEntity` from `@ngrx/signals/entities`.
- Reusable behavior: `signalStoreFeature(...)` (e.g. a `withRequestStatus()` feature).
- Export the store and its `InstanceType` alias from the lib's `index.ts`.

## ComponentStore

`@ngrx/component-store` is installed for legacy use. Don't start new ComponentStores — use
SignalStore.

## Testing

- **Reducers:** `reducer(state, action)` → assert state. **Selectors:** `selector.projector(...)`.
- **Effects:** `provideMockActions(() => actions$)` + mocked services; marbles via
  `jasmine-marbles` (`hot`, `cold`, `toBeObservable`) are available, or subscribe and assert.
- **Facades:** `TestBed` with `provideStore` + `provideState` + `provideEffects` (the old NgModule
  test style in existing specs is fine to keep), then `readFirst(facade.x$)` from
  `@nx/angular/testing`.
- **Components using a facade:** provide a mock facade (`{ provide: CartFacade, useValue: { … } }`)
  or `provideMockStore({ initialState })` + `overrideSelector`.
- **SignalStore:** provide the store and mocked deps in `TestBed`, call methods, assert signals.
