import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({ 
      projectId: "simple-crm-71152", 
      appId: "1:975414178168:web:479eda1efd97d5fadad88d", 
      storageBucket: "simple-crm-71152.appspot.com", 
      apiKey: "AIzaSyA4EZ1BcZW_0HmPNkcbwR8xeWMZohkJf0U", 
      authDomain: "simple-crm-71152.firebaseapp.com", 
      messagingSenderId: "975414178168" 
    })),
    provideFirestore(() => getFirestore()),
    provideCharts(withDefaultRegisterables())
  ]
};