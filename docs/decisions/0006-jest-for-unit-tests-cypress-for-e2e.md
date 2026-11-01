---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: Unit tests use Jest and E2E/component tests use Cypress, run through Nx; don't add Vitest, Karma or Playwright unless asked.
globs: ["**/*.spec.ts", "**/*.cy.ts", "**/jest.config.*", "**/cypress.config.*", "apps/*-e2e/**"]
enforced-by: review
superseded-by:
---

# Jest for unit tests, Cypress for E2E and component tests

## Context and Problem Statement

New Angular projects default to Vitest, and many examples use Playwright. Every project here is set up
with Jest (`jest-preset-angular`) and every app has a Cypress `<app>-e2e` project. Mixing runners would
split configuration and CI.

## Considered Options

- Keep Jest + Cypress
- Move to Vitest and/or Playwright

## Decision Outcome

Chosen option: "Keep Jest + Cypress", because all existing tests and Nx targets use them.

- Unit tests are Jest specs (`*.spec.ts`), run with `npx nx test <project>`.
- E2E tests live in `apps/<app>-e2e` and component tests use `npx nx component-test <lib>`, both Cypress.
- Don't call `jest` or `cypress` directly, and don't add Vitest, Karma or Playwright unless asked.

### Consequences

- Good: one setup per test type, already wired into Nx and CI.
- Bad: drifts from the Angular CLI default; revisit if Jest support for Angular lags.

### Confirmation

Code review. A runner change needs a new ADR that supersedes this one.
