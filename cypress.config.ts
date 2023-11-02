import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.BASE_URL,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 30000,
  },
});
