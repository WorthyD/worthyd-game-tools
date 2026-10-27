import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      ciWebServerCommand: 'npx nx run destiny-clan-dashboard:serve-static',
      webServerCommands: {
        default: 'npx nx run destiny-clan-dashboard:serve:development',
        production: 'npx nx run destiny-clan-dashboard:serve:production',
        ci: 'npx nx run destiny-clan-dashboard:serve-static'
      },
      cypressDir: 'src'
    }),
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true
  }
});
