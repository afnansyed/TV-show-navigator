// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { ShowService, Show } from './query-shows.service';
import { AuthenticationService, User } from './authentication.service';

export interface RatingItem {
  showID: string;
  rating: number;
}

export interface CommentItem {
  commentID?: number; // Added to support unique ID for deletion
  showID: string;
  comment: string;
  timestamp?: string; // Added to match API response
}

export interface WatchlistItem {
  showID: string;
  status: number;
}

export interface UserProfile {
  user: User;
  watchlist: WatchlistItem[];
  ratings: RatingItem[];
  comments: CommentItem[];
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = 'http://localhost:8080';
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private showService: ShowService,
  ) {
    // whenever the currentUser changes, reload everything
    this.auth.currentUser$
      .pipe(
        switchMap(user => {
          if (!user) return of(null);

          const userID = user.id.toString();
          const w$ = this.http.get<WatchlistItem[]>(`${this.baseUrl}/watchlist`, {
            params: new HttpParams().set('userID', userID)
          }).pipe(
            catchError(err => {
              console.error('Failed to load watchlist', err);
              return of([]);  // Return empty array instead of error
            })
          );

          const r$ = this.http.get<RatingItem[]>(`${this.baseUrl}/ratings`, {
            params: new HttpParams().set('userID', userID)
          }).pipe(
            catchError(err => {
              console.error('Failed to load ratings', err);
              return of([]);  // Return empty array instead of error
            })
          );

          const c$ = this.http.get<CommentItem[]>(`${this.baseUrl}/comments`, {
            params: new HttpParams().set('userID', userID)
          }).pipe(
            catchError(err => {
              console.error('Failed to load comments', err);
              return of([]);  // Return empty array instead of error
            })
          );

          return forkJoin({ w$, r$, c$ }).pipe(
            map(({ w$, r$, c$ }) => ({
              user,
              watchlist: w$ || [],
              ratings: r$ || [],
              comments: c$ || []
            }))
          );
        }),
        catchError(err => {
          console.error('Profile load failed', err);
          return of(null);
        })
      )
      .subscribe(profile => this.profileSubject.next(profile));
  }

  /** add or update a watchlist entry (status=1) */
  addToWatchlist(showID: string): Observable<any> {
    const user = this.auth.currentUserValue!;
    const payload = { userID: user.id, showID, status: 1 };
    return this.http
      .post(`${this.baseUrl}/watchlist`, payload)
      .pipe(switchMap(() => this.reloadWatchlist()));
  }

  // Implementation using query parameters
  removeFromWatchlist(showID: string): Observable<any> {
    const user = this.auth.currentUserValue!;
    const params = new HttpParams()
      .set('userID', user.id.toString())
      .set('showID', showID);

    return this.http.delete(`${this.baseUrl}/watchlist`, { params })
      .pipe(
        switchMap(() => this.reloadWatchlist())
      );
  }

  /**
   * Set a rating for a show
   * Maps to /ratings POST endpoint - note there's no update API,
   * so adding a new rating will override any existing one
   */
  setRating(showID: string, rating: number): Observable<any> {
    const user = this.auth.currentUserValue!;

    // Try both parameter names to handle possible API inconsistency
    // According to the documentation, it should be 'ratings', but let's be safe
    const payload = {
      userID: user.id,
      showID,
      rating: rating,     // Try with singular 'rating'
      ratings: rating     // Also include 'ratings' as in the documentation
    };

    console.log('Sending rating payload:', payload);

    return this.http.post(`${this.baseUrl}/ratings`, payload).pipe(
      tap(response => console.log('Rating success response:', response)),
      catchError(error => {
        console.error('Rating error details:', error);
        return throwError(() => error);
      }),
      switchMap(() => this.reloadRatings())
    );
  }

  /**
   * Delete a rating for a show
   */
  deleteRating(showID: string): Observable<any> {
    const user = this.auth.currentUserValue!;
    const params = new HttpParams()
      .set('userID', user.id.toString())
      .set('showID', showID);

    return this.http.delete(`${this.baseUrl}/ratings`, { params })
      .pipe(
        tap(response => console.log('Delete rating response:', response)),
        catchError(error => {
          console.error('Error deleting rating:', error);
          return throwError(() => error);
        }),
        switchMap(() => this.reloadRatings())
      );
  }

  /**
   * Add a comment to a show
   * Maps to /comments POST endpoint
   */
  addComment(showID: string, comment: string): Observable<any> {
    const user = this.auth.currentUserValue!;
    return this.http.post(`${this.baseUrl}/comments`, {
      userID: user.id,
      showID,
      comment
    }).pipe(
      switchMap(() => this.reloadComments())
    );
  }

  /**
   * Delete a comment by ID
   * Maps to /comments DELETE endpoint
   */
  deleteComment(commentID: number): Observable<any> {
    const params = new HttpParams().set('id', commentID.toString());

    return this.http.delete(`${this.baseUrl}/comments`, { params })
      .pipe(
        switchMap(() => this.reloadComments())
      );
  }

  /**
   * Check if a show is in the user's watchlist
   * Fixed to properly handle null values
   */
  public isInWatchlist(showID: string): boolean {
    const p = this.profileSubject.value;
    // Make sure both p and p.watchlist exist before calling .some()
    return !!p && !!p.watchlist && p.watchlist.some(i => i.showID === showID);
  }

  /** Helpers to reload just one slice and re‑emit full profile */
  private reloadWatchlist() {
    const user = this.auth.currentUserValue!;
    return this.http
      .get<WatchlistItem[]>(
        `${this.baseUrl}/watchlist`,
        { params: new HttpParams().set('userID', user.id.toString()) }
      )
      .pipe(
        catchError(err => {
          console.error('Failed to reload watchlist', err);
          return of([]);
        }),
        tap(watchlist => {
          const p = this.profileSubject.value;
          if (p) {
            this.profileSubject.next({ ...p, watchlist });
          }
        })
      );
  }

    /**
   * Improved method to reload ratings data after a change
   */
  private reloadRatings() {
    return this.auth.currentUser$.pipe(
      switchMap(user => {
        if (!user) return of([]);

        const p = this.profileSubject.value;
        if (!p) return of([]);

        const userID = user.id.toString();
        console.log(`Reloading ratings for user ${userID}...`);

        return this.http.get<RatingItem[]>(`${this.baseUrl}/ratings`, {
          params: new HttpParams().set('userID', userID)
        }).pipe(
          tap(ratings => {
            console.log('New ratings data:', ratings);
          }),
          catchError(err => {
            console.error('Failed to reload ratings', err);
            return of([]);
          }),
          tap(ratings => {
            // Create a new profile object with updated ratings
            const updatedProfile = { ...p, ratings };
            console.log('Updating profile with new ratings:', updatedProfile);
            this.profileSubject.next(updatedProfile);
          })
        );
      })
    );
  }

  private reloadComments() {
    return this.auth.currentUser$.pipe(
      switchMap(user => {
        if (!user) return of([]);

        const p = this.profileSubject.value;
        if (!p) return of([]);

        const userID = user.id.toString();
        return this.http.get<CommentItem[]>(`${this.baseUrl}/comments`, {
          params: new HttpParams().set('userID', userID)
        }).pipe(
          catchError(err => {
            console.error('Failed to reload comments', err);
            return of([]);
          }),
          tap(comments => this.profileSubject.next({ ...p, comments }))
        );
      })
    );
  }
}
