import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './core/views/home/home.component';
import { CreateTripComponent } from './core/views/create-trip/create-trip.component';
import { MyProfileComponent } from './core/views/my-profile/my-profile.component';
import { TripsComponent } from './core/views/trips/trips.component';


export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: '/home'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }, {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'create',
        component: CreateTripComponent
    },
    {
        path: 'myprofile/:id',
        component: MyProfileComponent
    },
    {
        path: 'trips',
        component: TripsComponent
    }];
