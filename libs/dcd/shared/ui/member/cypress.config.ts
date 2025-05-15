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
    ...nxComponentTestingPreset(__filename),
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true
  }
});
