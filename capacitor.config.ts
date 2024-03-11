import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.translation.app',
  appName: 'translationCheckApp',
  webDir: 'dist/translation-check-app',
  server: {
    androidScheme: 'https'
  }
};

export default config;
