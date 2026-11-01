---
status: proposed
date: 2026-11-01
decision-makers: Daniel
summary: Craft Cart state lives in NgRx SignalStores (CartStore, CatalogStore) in @crafting-cart/state; don't add classic Store, effects or facades to Craft Cart.
globs: ["apps/craft-cart/**", "apps/stardew-craft-cart/**", "libs/craft-cart/**"]
enforced-by: review
superseded-by:
---

# Use SignalStore for Craft Cart state

## Context and Problem Statement

Craft Cart's state (`@crafting-cart/state`) was a classic NgRx Store: actions, entity-adapter
reducers, selectors, a persistence effect, a local-storage meta-reducer and facades over it, for two
small, app-wide collections (cart and catalog). Components converted facade observables back to
signals. The ceremony outweighed the state, and several generated specs had rotted.

## Considered Options

- Replace the classic Store with `@ngrx/signals` SignalStores
- Keep the classic Store and facades
- Plain services holding `signal()`s

## Decision Outcome

Chosen option: "SignalStore", because it fits the size of the state, gives signals directly to
standalone components, and is already used in the repo (`PlayerSidebarStore`).

- Craft Cart state is `CartStore` and `CatalogStore` in `libs/craft-cart/shared/data-access-state`,
  built with `signalStore` + `withEntities` and `providedIn: 'root'`.
- Components inject the stores directly and read signals (`entities()`, `entityMap()`,
  `cartCount()`); derive view models with `computed()`. There are no facades.
- State changes go through store methods (`patchState` inside the store only).
- Side effects such as local-storage persistence live in the store's `withHooks` (`watchState`),
  not in components. The cart is stored under `cart` in the `{ ids, entities }` shape so carts
  saved by the old Store keep loading.
- Don't add `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity` or facades to Craft Cart projects.
- Apps must provide `getLocalStorageToken()` for `CartStore`.

### Consequences

- Good: far less code, signals end to end, simpler tests (inject the store, call methods, assert).
- Bad: no Redux DevTools for Craft Cart; DCD and Craft Cart now use different state patterns.

### Confirmation

Code review: no `@ngrx/store`/`@ngrx/effects` imports under Craft Cart paths.

## More Information

Applies ADR 0003's "migrate when asked" to Craft Cart. DCD's classic Store is unaffected.
