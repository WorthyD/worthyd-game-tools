---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: New Angular code is standalone with inject(); existing DCD NgModules and constructor injection are only migrated when asked.
globs: ["apps/destiny-clan-dashboard/**", "apps/destiny-clan-dashboard-demo/**", "libs/dcd/**"]
enforced-by: review
superseded-by:
---

# Migrate Angular code incrementally, not in drive-by refactors

## Context and Problem Statement

DCD is the older codebase: many libs are NgModule-based (`*.module.ts`, `*-routes.module.ts`), routes
lazy-load modules, and services often use constructor injection. Agents tend to "modernize" whatever
file they touch, which makes diffs large, hard to review and risky.

## Considered Options

- Migrate incrementally: new code is modern, existing code changes only when asked
- Migrate DCD to standalone in one go
- Keep writing NgModule-style code in DCD to match

## Decision Outcome

Chosen option: "Migrate incrementally", because it keeps changes small and reviewable while new code
still uses current patterns.

- New components, directives and pipes are standalone and use `inject()`, signals and `OnPush`, in
  either product.
- When adding to an existing DCD NgModule lib, write the new component as standalone and add it to the
  module's `imports`/`exports`. Don't convert the rest of the module.
- Don't refactor existing NgModules to standalone, constructor injection to `inject()`, or NgRx Store
  to SignalStore unless the task asks for it.

### Consequences

- Good: small diffs, and the old and new patterns coexist safely.
- Bad: DCD stays mixed-style for a long time.

### Confirmation

Code review: a diff that converts existing code the task didn't ask about is sent back.
