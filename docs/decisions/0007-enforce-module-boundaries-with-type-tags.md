---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: Every lib has exactly one type:* tag, imports go only through tsconfig.base.json aliases, and module-boundary lint rules are never loosened to make an import pass.
globs: ["**/project.json", "eslint.config.cjs", "**/eslint.config.*", "tsconfig.base.json"]
enforced-by: "@nx/enforce-module-boundaries"
superseded-by:
---

# Enforce module boundaries with type tags and import aliases

## Context and Problem Statement

The repo has two products and shared libs. Without boundaries, features import each other's internals
and libs grow circular dependencies. Nx can enforce a layering if every lib is tagged.

## Considered Options

- `type:*` tags with `@nx/enforce-module-boundaries`
- `type:*` plus `scope:*` (product) tags
- No enforced boundaries

## Decision Outcome

Chosen option: "`type:*` tags with `@nx/enforce-module-boundaries`", because it gives a clear layering
with a single tag per lib. Product scope tags were left out for now; cross-product imports are a rule
enforced by review.

- Every lib has exactly one of `type:feature`, `type:ui`, `type:data-access`, `type:util`, `type:model`
  (apps are `type:app`). Use generators so tags are set.
- Import other libs only through their `tsconfig.base.json` alias. No relative paths into other libs
  and no deep imports.
- DCD and Craft Cart don't import each other; share code through `libs/shared` (`@worthyd/shared/...`).
- Never loosen `depConstraints` or disable the rule to make an import pass. Move the code to the right
  lib type instead.

### Consequences

- Good: lint catches layering violations before review.
- Bad: sometimes code has to move libs before a feature can use it.

### Confirmation

`@nx/enforce-module-boundaries` in `eslint.config.cjs`, run by `npx nx affected -t lint`.
