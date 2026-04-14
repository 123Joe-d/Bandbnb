import type { CapacitorConfig } from '@capacitor/cli';

const remoteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const config: CapacitorConfig = {
  appId: 'com.bandbnb.app',
  appName: 'Bandbnb',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: remoteUrl,
    cleartext: remoteUrl.startsWith('http://')
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#0f172a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
