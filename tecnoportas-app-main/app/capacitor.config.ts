/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tecnoportas.app',
  appName: 'Tecnoportas',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    allowNavigation: ['*', 'apptecnoportas.com.br'],
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#ffffff',
      launchAutoHide: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'large',
      spinnerColor: '#2808a1',
    }
  }
};

export default config;
