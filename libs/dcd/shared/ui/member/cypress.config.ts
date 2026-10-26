import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { defineConfig } from 'cypress';
import { defaultConfig } from '../../../../../apps/destiny-clan-dashboard-e2e/cypress.component.config';

// export default defineConfig(defaultConfig);
//import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
// import { defineConfig } from 'cypress';
// import {defaultConfig} from '../../../../../apps/destiny-clan-dashboard-e2e/cypress.component.config';

export default defineConfig({
  component: {
    //   devServer: {
    //     options: {
    //       projectConfig: {
    //         buildOptions: {}
    //       }
    //     }
    //   },
    ...nxComponentTestingPreset(__filename, { buildTarget: 'destiny-clan-dashboard:build' }),
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
    // Cypress 14+ defaults justInTimeCompile to true (webpack only), which can
    // intermittently run 0 tests in CI. Remove this line to opt back in.
    justInTimeCompile: false
  }
});
