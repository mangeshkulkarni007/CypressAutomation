const { defineConfig } = require('cypress');
const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot/plugin');

module.exports = defineConfig({
  projectId: 'edyt4s',
  defaultCommandTimeout: 15000,
  e2e: {
    baseUrl: 'https://qa-insight.kellton.net',
    specPattern: '**/*.cy.js',
    defaultCommandTimeout: 15000,
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on);
    },
    retries: {
      runMode: 1,
    },
  },
  viewportHeight: 900,
  viewportWidth: 1440,
  env: {
    insightUser: 'machine_operator',
    insightPassword: 'Cimetrix01',
    compassUser: 'process_engineer',
    compassPassword: 'C!m3tR1x93',
    sapienceUser: 'factory_manager',
    sapiencePassword: 'Cimetrix02',
    sapienceAPIUser: 'sapience_admin',
    sapienceAPIPassword: 'C!m3tR1x5@',
    sapienceAPIUserNameInUI: 'Sapience Administrator',
    settingUser: 'elastic',
    settingsPassword: 'cimetrix',
  },
});
