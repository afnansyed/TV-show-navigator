import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Optional default route
];
