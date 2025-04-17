import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Show } from './query-shows.service';

export interface UserProfile {
  username: string;
  password: string; // For mocking purposes only; never store plaintext passwords in production!
  watchlist: Show[];
  ratings: { [tconst: string]: number };  // Mapping from show ID to rating
  comments: { [tconst: string]: string[] }; // Mapping from show ID to comments
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Holds the current user profile (or null if not logged in)
  public userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  // Tracks logged-in state; starts as false.
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {

  }

  /**
   * Simulate login. In this mock, if the provided credentials match
   * the dummy account, create a new profile and mark the user as logged in.
   */
  login(username: string, password: string): Observable<boolean> {
    const dummyUsername = 'testuser';
    const dummyPassword = 'testpass';

    if (username === dummyUsername && password === dummyPassword) {
      // If not already logged in, create the dummy profile.
      if (!this.userProfileSubject.value) {
        const profile: UserProfile = {
          username: dummyUsername,
          password: dummyPassword,
          watchlist: [],
          ratings: {},
          comments: {}
        };
        this.updateProfile(profile);
      }
      return of(true);
    }
    return of(false);
  }

  /**
   * Log out by clearing the profile and updating logged-in state.
   */
  logout(): void {
    localStorage.removeItem('userProfile');
    this.userProfileSubject.next(null);
    this.loggedInSubject.next(false);
  }

  /**
   * Add a show to the user's watchlist.
   */
  addShowToWatchlist(show: Show): void {
    const profile = this.userProfileSubject.value;
    if (profile && !this.isInWatchlist(show)) {
      profile.watchlist.push(show);
      this.updateProfile(profile);
    }
  }

  /**
   * Remove a show from the user's watchlist.
   */
  removeShowFromWatchlist(show: Show): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      profile.watchlist = profile.watchlist.filter(s => s.tconst !== show.tconst);
      this.updateProfile(profile);
    }
  }

  /**
   * Record a rating for a show.
   */
  rateShow(show: Show, rating: number): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      profile.ratings[show.tconst] = rating;
      this.updateProfile(profile);
    }
  }

  /**
   * Add a comment for a show.
   */
  addComment(show: Show, comment: string): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      if (!profile.comments[show.tconst]) {
        profile.comments[show.tconst] = [];
      }
      profile.comments[show.tconst].push(comment);
      this.updateProfile(profile);
    }
  }

    /**
   * Replace (or set) the comment for a given show.
   */
  setComment(show: Show, comment: string): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      // Replace the comment array with a single new comment
      profile.comments[show.tconst] = [comment];
      this.updateProfile(profile);
    }
  }
  /**
   * Check if a show is already in the user's watchlist.
   */
  isInWatchlist(show: Show): boolean {
    const profile = this.userProfileSubject.value;
    return profile ? profile.watchlist.some(s => s.tconst === show.tconst) : false;
  }

  /**
   * Update the user profile and mark the user as logged in.
   */
  private updateProfile(profile: UserProfile): void {
    this.userProfileSubject.next(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    this.loggedInSubject.next(true);
  }

  /**
   * Check if the user is logged in.
   */
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
