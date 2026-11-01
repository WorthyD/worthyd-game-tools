---
description: "ADR 0002 (binding): All apps keep zone.js change detection; don't write zoneless-only code or migrate apps to zoneless unless asked."
paths:
  - "apps/**"
  - "libs/**/*.ts"
---
<!-- GENERATED from docs/decisions/0002-keep-zone-js-change-detection.md by tools/ai/sync-ai-rules.mjs — edit the source, then run `npm run ai:sync`. -->

# ADR 0002: Keep zone.js change detection in all apps

**Status: accepted — binding.** All apps keep zone.js change detection; don't write zoneless-only code or migrate apps to zoneless unless asked.

If your task conflicts with this decision, stop and say so instead of working around it. Full record: [0002-keep-zone-js-change-detection.md](../../docs/decisions/0002-keep-zone-js-change-detection.md).

Chosen option: "Keep zone.js everywhere", because a migration is a project of its own and mixing
modes across shared libs is error-prone.

- Apps keep `provideZoneChangeDetection` and the `zone.js` polyfill.
- New code must work under zone.js. Signals and `OnPush` are encouraged, but don't rely on
  zoneless-only behavior.
- Unit tests use the zone test environment (`setupZoneTestEnv`); `fakeAsync`/`tick` are fine.
- Don't remove zone.js, add `provideZonelessChangeDetection`, or migrate an app unless asked.

## Consequences

- Good: existing DCD code and tests keep working without changes.
- Bad: zone.js stays in the bundle, and the repo drifts from the Angular default.

## Confirmation

Code review. A move to zoneless needs a new ADR that supersedes this one.
