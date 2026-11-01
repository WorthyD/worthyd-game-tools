---
description: "ADR 0003 (binding): New Angular code is standalone with inject(); existing DCD NgModules and constructor injection are only migrated when asked."
paths:
  - "apps/destiny-clan-dashboard/**"
  - "apps/destiny-clan-dashboard-demo/**"
  - "libs/dcd/**"
---
<!-- GENERATED from docs/decisions/0003-migrate-angular-code-incrementally.md by tools/ai/sync-ai-rules.mjs — edit the source, then run `npm run ai:sync`. -->

# ADR 0003: Migrate Angular code incrementally, not in drive-by refactors

**Status: accepted — binding.** New Angular code is standalone with inject(); existing DCD NgModules and constructor injection are only migrated when asked.

If your task conflicts with this decision, stop and say so instead of working around it. Full record: [0003-migrate-angular-code-incrementally.md](../../docs/decisions/0003-migrate-angular-code-incrementally.md).

Chosen option: "Migrate incrementally", because it keeps changes small and reviewable while new code
still uses current patterns.

- New components, directives and pipes are standalone and use `inject()`, signals and `OnPush`, in
  either product.
- When adding to an existing DCD NgModule lib, write the new component as standalone and add it to the
  module's `imports`/`exports`. Don't convert the rest of the module.
- Don't refactor existing NgModules to standalone, constructor injection to `inject()`, or NgRx Store
  to SignalStore unless the task asks for it.

## Consequences

- Good: small diffs, and the old and new patterns coexist safely.
- Bad: DCD stays mixed-style for a long time.

## Confirmation

Code review: a diff that converts existing code the task didn't ask about is sent back.
