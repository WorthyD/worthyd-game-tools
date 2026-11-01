---
description: "ADR 0007 (binding): Every lib has exactly one type:* tag, imports go only through tsconfig.base.json aliases, and module-boundary lint rules are never loosened to make an import pass."
applyTo: "**/project.json,eslint.config.cjs,**/eslint.config.*,tsconfig.base.json"
---
<!-- GENERATED from docs/decisions/0007-enforce-module-boundaries-with-type-tags.md by tools/ai/sync-ai-rules.mjs — edit the source, then run `npm run ai:sync`. -->

# ADR 0007: Enforce module boundaries with type tags and import aliases

**Status: accepted — binding.** Every lib has exactly one type:* tag, imports go only through tsconfig.base.json aliases, and module-boundary lint rules are never loosened to make an import pass.

If your task conflicts with this decision, stop and say so instead of working around it. Full record: [0007-enforce-module-boundaries-with-type-tags.md](../../docs/decisions/0007-enforce-module-boundaries-with-type-tags.md).

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

## Consequences

- Good: lint catches layering violations before review.
- Bad: sometimes code has to move libs before a feature can use it.

## Confirmation

`@nx/enforce-module-boundaries` in `eslint.config.cjs`, run by `npx nx affected -t lint`.
