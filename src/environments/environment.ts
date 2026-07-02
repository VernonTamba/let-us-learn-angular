/**
 * =============================================================================
 * ENVIRONMENT - Development Configuration
 * =============================================================================
 *
 * 📘 KONSEP: Environment Configuration
 *
 * Angular menggunakan file environment untuk menyimpan konfigurasi
 * yang berbeda antara development dan production.
 *
 * Build system akan otomatis swap file ini berdasarkan configuration.
 * =============================================================================
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000/ws',

  // WITSML Server configuration
  witsmlServer: {
    url: 'http://localhost:8080/witsml',
    version: '2.0',
    timeout: 30000
  },

  // Feature flags
  features: {
    realTimeStreaming: true,
    advancedCharts: true,
    darkMode: false,
    experimentalSignals: true
  },

  // Logging
  logging: {
    level: 'debug',
    enableConsole: true
  }
};
