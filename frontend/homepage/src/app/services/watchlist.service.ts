// src/app/services/watchlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

// ▶ Change this import:
import { AuthenticationService } from './authentication.service';
import { Show } from './query-shows.service';

export interface WatchlistItem {
  userID: number;
  showID: string;
  status: number;
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private apiUrl = 'http://localhost:8080/watchlist';

  private itemsSubject = new BehaviorSubject<WatchlistItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService   // ← use AuthenticationService
  ) {}

  loadWatchlist(): Observable<WatchlistItem[]> {
    const user = this.auth.currentUserSubject.value;
    if (!user) {
      this.itemsSubject.next([]);
      return of([]);
    }

    const params = new HttpParams().set('userID', user.id.toString());
    return this.http.get<WatchlistItem[]>(this.apiUrl, { params }).pipe(
      tap(items => this.itemsSubject.next(items)),
      catchError(err => {
        console.error('Failed to fetch watchlist', err);
        return throwError(() => err);
      })
    );
  }

  addShowToWatchlist(show: Show): Observable<WatchlistItem[]> {
    const user = this.auth.currentUserSubject.value!;
    const payload = { userID: user.id, showID: show.tconst, status: 1 };
    return this.http.post(this.apiUrl, payload).pipe(
      switchMap(() => this.loadWatchlist())
    );
  }

  removeShowFromWatchlist(show: Show): Observable<WatchlistItem[]> {
    const user = this.auth.currentUserSubject.value!;
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { userID: user.id, showID: show.tconst }
    };
    return this.http.delete(this.apiUrl, options).pipe(
      switchMap(() => this.loadWatchlist())
    );
  }

  isInWatchlist(show: Show): boolean {
    return this.itemsSubject.value.some(i => i.showID === show.tconst);
  }
}
