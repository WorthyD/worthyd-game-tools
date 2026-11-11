---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: Craft Cart and libs/shared are standalone-only; don't add NgModules there.
globs: ["apps/cozy-almanacs/**", "apps/stardew-cozy-almanacs/**", "libs/cozy-almanacs/**", "libs/shared/**"]
enforced-by: review
superseded-by:
---

# Craft Cart and shared libs are standalone-only

## Context and Problem Statement

Craft Cart and the cross-product libs in `libs/shared` were written with standalone APIs from the
start. Copying patterns from DCD (or from older examples) would bring NgModules back into them.

## Considered Options

- Standalone-only
- Allow NgModules where convenient

## Decision Outcome

Chosen option: "Standalone-only", because these projects have no NgModules in their source today and
keeping it that way keeps one pattern per product.

- No `@NgModule` in `apps/cozy-almanacs`, `apps/stardew-cozy-almanacs`, `libs/cozy-almanacs/**` or `libs/shared/**`
  source. Test-only modules in `*.spec.ts` are fine.
- Routing uses `Routes` arrays; providers go in `app.config.ts` or route `providers`.
- Use `inject()` rather than constructor injection.
- Third-party NgModules (for example Angular Material modules) may still be imported into standalone
  components.

### Consequences

- Good: one consistent pattern, easy to follow for people and agents.
- Bad: none known.

### Confirmation

Code review. Could be enforced with `@angular-eslint/prefer-standalone` scoped to these folders.
