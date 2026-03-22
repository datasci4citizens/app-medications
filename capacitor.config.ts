import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.datasci4citizens.lembramed',
  appName: 'LembraMed',
  webDir: 'dist',
  plugins: { 
    // Resolve bug CORS backend not accept Localhost
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
