import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './core/views/home/home.component';
import { CreateTripComponent } from './core/views/create-trip/create-trip.component';
import { MyProfileComponent } from './core/views/my-profile/my-profile.component';
import { TripsComponent } from './core/views/trips/trips.component';
import { TripComponent } from './core/views/trip/trip.component';
import { EditComponent } from './core/views/edit/edit.component';
import { GalleryComponent } from './core/views/gallery/gallery.component';
import { AuthGuard } from './Guard/auth.guard';



export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: '/home'
    },
    {
        path: 'home',
        component: HomeComponent,
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
        component: CreateTripComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'myprofile/:id',
        component: MyProfileComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'trips',
        component: TripsComponent
    },
    {
        path: 'trips/:id',
        component: TripComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'edit/:id',
        component: EditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'trips/:id/gallery',
        component: GalleryComponent,
        canActivate: [AuthGuard],
    }];
