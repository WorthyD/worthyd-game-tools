---
description: Cypress 15 in Nx — E2E projects per app, component tests in ui libs, selectors, intercepts, no fixed waits, typed commands
globs: ["**/*.cy.ts", "**/cypress/**", "**/*-e2e/**", "**/cypress.config.*"]
---

# Cypress

Installed: **Cypress 15.8**, `@nx/cypress` (targets inferred by `@nx/cypress/plugin`).

## E2E projects

```
apps/<app>-e2e/
  cypress.config.ts        # nxE2EPreset(__filename, { cypressDir: 'src', webServerCommands, ciWebServerCommand })
  src/e2e/*.cy.ts
  src/support/{commands.ts,e2e.ts,app.po.ts}
  src/fixtures/*.json
```

```bash
npx nx e2e craft-cart-e2e                     # starts `craft-cart:serve`, runs headless
npx nx e2e craft-cart-e2e --spec=src/e2e/cart.cy.ts
npx nx open-cypress craft-cart-e2e            # interactive
npx nx e2e-ci craft-cart-e2e                  # against serve-static, split per spec
```

- The web server comes from `webServerCommands`; use relative URLs (`cy.visit('/catalog')`).
- The existing specs and `cy.login(...)` command are generator placeholders — replace them when
  writing real tests.
- DCD calls the live Bungie API; **stub it** with `cy.intercept` + fixtures so tests don't depend
  on the network or an API key.

## Component tests (ui libs)

Some `ui` libs (e.g. `item-card`, `cart-item-card`, `cart-quantity`, `@dcd/shared/ui/member`)
have Cypress component testing: `cypress.config.ts` at the lib root, `cypress/support/component.ts`
registering `cy.mount`, and `*.component.cy.ts` beside the component.

```bash
npx nx component-test item-card
```

```ts
it('emits when Add is clicked', () => {
  cy.mount(ItemCardComponent, {
    componentProperties: { item: anItem({ name: 'Iron Bar' }) },
    autoSpyOutputs: true                       // creates an `@<output>Spy` alias per output
  });
  cy.get('[data-cy=add]').click();
  cy.get('@addedSpy').should('have.been.calledOnce');
});
```

Use component tests for interaction/visual behavior; keep logic tests in Jest.

## Selectors

- Add `data-cy="..."` attributes to templates as part of the change and select with
  `cy.get('[data-cy=cart-count]')`.
- Second choice: `cy.contains('button', 'Add to cart')`.
- Never select by Material (`.mat-mdc-*`), Tailwind or structural selectors.
- Material overlays render in `.cdk-overlay-container`; put `data-cy` on options/dialog content.

## Waiting and network

- **No `cy.wait(<ms>)`.** Assertions retry; assert on the outcome.
- Alias and wait on requests:

  ```ts
  cy.intercept('GET', '**/Platform/GroupV2/**', { fixture: 'clan.json' }).as('getClan');
  cy.visit('/');
  cy.wait('@getClan');
  cy.get('[data-cy=member-row]').should('have.length.greaterThan', 0);
  ```

- Command results aren't values — chain, use `.then()`, or aliases.

## Test design

- Each test is independent; no reliance on order.
- Craft Cart persists the cart in local storage — clear or seed it in `beforeEach`
  (`cy.clearLocalStorage()` / `win.localStorage.setItem(...)` in `onBeforeLoad`).
- No conditional testing; make state deterministic.
- One journey per `it`, descriptive names.

## Custom commands

Typed, in `src/support/commands.ts`:

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      seedCart(items: { itemId: string; quantity: number }[]): Chainable<void>;
    }
  }
}
```

Secrets come from `Cypress.env()` / CI env vars — never commit credentials or API keys in specs or
fixtures.
