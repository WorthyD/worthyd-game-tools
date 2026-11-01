---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: All apps keep zone.js change detection; don't write zoneless-only code or migrate apps to zoneless unless asked.
globs: ["apps/**", "libs/**/*.ts"]
enforced-by: review
superseded-by:
---

# Keep zone.js change detection in all apps

## Context and Problem Statement

Angular now defaults new apps to zoneless change detection. Every app in this repo bootstraps with
`provideZoneChangeDetection`, and DCD in particular has older code (NgModules, RxJS-driven state,
`fakeAsync` tests) that assumes zone.js. Agents trained on current Angular tend to write zoneless code
or suggest migrating.

## Considered Options

- Keep zone.js everywhere
- Migrate all apps to zoneless
- Migrate Craft Cart only

## Decision Outcome

Chosen option: "Keep zone.js everywhere", because a migration is a project of its own and mixing
modes across shared libs is error-prone.

- Apps keep `provideZoneChangeDetection` and the `zone.js` polyfill.
- New code must work under zone.js. Signals and `OnPush` are encouraged, but don't rely on
  zoneless-only behavior.
- Unit tests use the zone test environment (`setupZoneTestEnv`); `fakeAsync`/`tick` are fine.
- Don't remove zone.js, add `provideZonelessChangeDetection`, or migrate an app unless asked.

### Consequences

- Good: existing DCD code and tests keep working without changes.
- Bad: zone.js stays in the bundle, and the repo drifts from the Angular default.

### Confirmation

Code review. A move to zoneless needs a new ADR that supersedes this one.
