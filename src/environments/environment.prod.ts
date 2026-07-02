/**
 * =============================================================================
 * ENVIRONMENT - Production Configuration
 * =============================================================================
 */

export const environment = {
  production: true,
  apiUrl: 'https://api.witsml-dashboard.com/api',
  wsUrl: 'wss://api.witsml-dashboard.com/ws',

  witsmlServer: {
    url: 'https://witsml-server.company.com/witsml',
    version: '2.0',
    timeout: 60000
  },

  features: {
    realTimeStreaming: true,
    advancedCharts: true,
    darkMode: true,
    experimentalSignals: true
  },

  logging: {
    level: 'error',
    enableConsole: false
  }
};
