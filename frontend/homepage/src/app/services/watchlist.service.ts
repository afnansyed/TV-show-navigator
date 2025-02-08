// watchlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Show } from './query-shows.service';  // adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private watchlist: Show[] = [];
  private watchlistSubject = new BehaviorSubject<Show[]>(this.watchlist);
  watchlist$ = this.watchlistSubject.asObservable();

  addShow(show: Show): void {
    if (!this.isInWatchlist(show)) {
      this.watchlist.push(show);
      this.watchlistSubject.next(this.watchlist);
    }
  }

  removeShow(show: Show): void {
    this.watchlist = this.watchlist.filter(s => s.tconst !== show.tconst);
    this.watchlistSubject.next(this.watchlist);
  }

  // Add this helper method
  isInWatchlist(show: Show): boolean {
    return this.watchlist.some(s => s.tconst === show.tconst);
  }
}
