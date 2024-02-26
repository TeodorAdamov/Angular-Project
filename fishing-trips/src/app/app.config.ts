import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
  importProvidersFrom(provideFirebaseApp(() => initializeApp({
    "projectId": "softuni-angular-project-dev",
    "appId": "1:652739181878:web:44ac658fa0443a8979c797",
    "storageBucket": "softuni-angular-project-dev.appspot.com",
    "apiKey": "AIzaSyBTrrrHaQiXw6DtUlpV0uxUPau0QDPLoCs",
    "authDomain": "softuni-angular-project-dev.firebaseapp.com",
    "messagingSenderId": "652739181878"
  }))),
  importProvidersFrom(provideAuth(() => getAuth())),
  importProvidersFrom(provideFirestore(() => getFirestore()))]
};
