---
description: "ADR 0006 (binding): Unit tests use Jest and E2E/component tests use Cypress, run through Nx; don't add Vitest, Karma or Playwright unless asked."
paths:
  - "**/*.spec.ts"
  - "**/*.cy.ts"
  - "**/jest.config.*"
  - "**/cypress.config.*"
  - "apps/*-e2e/**"
---
<!-- GENERATED from docs/decisions/0006-jest-for-unit-tests-cypress-for-e2e.md by tools/ai/sync-ai-rules.mjs — edit the source, then run `npm run ai:sync`. -->

# ADR 0006: Jest for unit tests, Cypress for E2E and component tests

**Status: accepted — binding.** Unit tests use Jest and E2E/component tests use Cypress, run through Nx; don't add Vitest, Karma or Playwright unless asked.

If your task conflicts with this decision, stop and say so instead of working around it. Full record: [0006-jest-for-unit-tests-cypress-for-e2e.md](../../docs/decisions/0006-jest-for-unit-tests-cypress-for-e2e.md).

Chosen option: "Keep Jest + Cypress", because all existing tests and Nx targets use them.

- Unit tests are Jest specs (`*.spec.ts`), run with `npx nx test <project>`.
- E2E tests live in `apps/<app>-e2e` and component tests use `npx nx component-test <lib>`, both Cypress.
- Don't call `jest` or `cypress` directly, and don't add Vitest, Karma or Playwright unless asked.

## Consequences

- Good: one setup per test type, already wired into Nx and CI.
- Bad: drifts from the Angular CLI default; revisit if Jest support for Angular lags.

## Confirmation

Code review. A runner change needs a new ADR that supersedes this one.
