import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familylife.app',
  appName: 'Beautiful Family Life',
  webDir: 'dist',
  server: {
    url: 'https://lilipopins.github.io/Beautiful-Family-Life-Management/',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
