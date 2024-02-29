import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';


import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), MatSnackBarModule,
  importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
  importProvidersFrom(provideAuth(() => getAuth())),
  importProvidersFrom(provideFirestore(() => getFirestore())),
  importProvidersFrom(provideStorage(() => getStorage())), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ]
};
