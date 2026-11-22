---
status: proposed
date: 2026-11-22
decision-makers: Daniel
summary: A game's catalog data and images live in its game app (e.g. apps/stardew-cozy-almanacs); cozy-almanacs ships none and borrows them only in its development build via fileReplacements and assets.
globs: ["apps/cozy-almanacs/**", "apps/stardew-cozy-almanacs/**"]
enforced-by: review
superseded-by:
---

# Game data lives in its game app; the hub borrows it only in dev builds

## Context and Problem Statement

`cozy-almanacs` (cozyalmanacs.com) is the hub for several game apps, but it held all of the Stardew
Valley catalog (`config.ts`, `items.ts`) and item images. Those belong to `stardew-cozy-almanacs`
(stardew.cozyalmanacs.com). The hub still needs realistic data to debug layouts and features locally.
Apps can't import from each other through aliases, and ADR 0007 routes every import through
`tsconfig.base.json` aliases.

## Considered Options

- Keep the data in the game app and swap it into the hub's development build with Angular
  `fileReplacements` plus an extra `assets` entry.
- Move the data into a lib (e.g. `libs/cozy-almanacs/stardew/data-catalog`) that both apps import.
- Keep the data in the hub and copy it to each game app.

## Decision Outcome

Chosen option: "keep the data in the game app and swap it into the hub's development build", because
it keeps each game's data with the site that ships it and keeps game data out of the hub's production
bundle, without a new lib type for static data.

- A game's catalog lives in `apps/<game>-cozy-almanacs/src/app/catalog/` (`config.ts`, `items.ts`,
  `datasets.ts`) and its images in `apps/<game>-cozy-almanacs/src/assets/`.
- `apps/cozy-almanacs/src/app/catalog/datasets.ts` exports an empty `catalogDatasets`. Only the
  `development` build configuration replaces it (`fileReplacements`) with a game app's `datasets.ts`
  and adds that app's `src/assets` to `assets`. The production build never includes game data.
- `cozy-almanacs` lists the game app in `implicitDependencies` so Nx caching and `affected` see the
  borrowed files.
- Never import a game app's files into `cozy-almanacs` with a relative path or alias.

### Consequences

- Good: each game app owns and deploys its own data; the hub's production bundle stays small.
- Good: `nx serve cozy-almanacs` still shows real data for debugging.
- Bad: the dev build pulls in another project's source outside the import graph, which lint can't
  check; `implicitDependencies` keeps Nx aware of it.
- Bad: the hub's production build shows an empty catalog until it has a game picker or its own data.

### Confirmation

Code review. `apps/cozy-almanacs/src/app/app.component.spec.ts` checks the hub ships no datasets,
and `apps/stardew-cozy-almanacs/src/app/app.component.spec.ts` checks the Stardew catalog resolves.

## More Information

Revisit when a second game app arrives or when the hub needs game data in production; a shared data
lib would then fit better. Related: ADR 0007 (module boundaries).
