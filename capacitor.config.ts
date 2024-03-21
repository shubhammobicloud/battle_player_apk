import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wurthbattleapp.app',
  appName: 'Wurth Battle App',
  webDir: 'dist/translation-check-app',
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
    cleartext: true
  }
};

export default config;
