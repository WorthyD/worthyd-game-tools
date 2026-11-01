---
description: "ADR 0004 (binding): Craft Cart and libs/shared are standalone-only; don't add NgModules there."
paths:
  - "apps/craft-cart/**"
  - "apps/stardew-craft-cart/**"
  - "libs/craft-cart/**"
  - "libs/shared/**"
---
<!-- GENERATED from docs/decisions/0004-craft-cart-and-shared-are-standalone-only.md by tools/ai/sync-ai-rules.mjs — edit the source, then run `npm run ai:sync`. -->

# ADR 0004: Craft Cart and shared libs are standalone-only

**Status: accepted — binding.** Craft Cart and libs/shared are standalone-only; don't add NgModules there.

If your task conflicts with this decision, stop and say so instead of working around it. Full record: [0004-craft-cart-and-shared-are-standalone-only.md](../../docs/decisions/0004-craft-cart-and-shared-are-standalone-only.md).

Chosen option: "Standalone-only", because these projects have no NgModules in their source today and
keeping it that way keeps one pattern per product.

- No `@NgModule` in `apps/craft-cart`, `apps/stardew-craft-cart`, `libs/craft-cart/**` or `libs/shared/**`
  source. Test-only modules in `*.spec.ts` are fine.
- Routing uses `Routes` arrays; providers go in `app.config.ts` or route `providers`.
- Use `inject()` rather than constructor injection.
- Third-party NgModules (for example Angular Material modules) may still be imported into standalone
  components.

## Consequences

- Good: one consistent pattern, easy to follow for people and agents.
- Bad: none known.

## Confirmation

Code review. Could be enforced with `@angular-eslint/prefer-standalone` scoped to these folders.
