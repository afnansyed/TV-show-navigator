import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent }, // Define "home" explicitly
  { path: 'sign-in', component: SignInComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirect '' to '/home'
];
