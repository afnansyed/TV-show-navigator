import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', 
    chromeWebSecurity: false, // Disable Chrome security to bypass mixed content issues
  },
});
