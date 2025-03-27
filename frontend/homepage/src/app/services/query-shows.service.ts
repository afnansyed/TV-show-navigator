// query-shows.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// This interface represents the raw response from the API.
export interface RawShow {
  tconst: string;
  primaryTitle: string;
  originalTitle: string;
  isAdult: number;       // API returns 1 for yes, 0 for no.
  genres: string;
  startYear: number;
  endYear: number;
  runtimeMinutes: number;
  avgRating: {
    Float64: number;
    Valid: boolean;
  };
  votes: {
    Int32: number;
    Valid: boolean;
  };
  title: string;         // According to documentation (typically the same as primaryTitle)
}

// This is the interface used in your Angular components.
export interface Show {
  tconst: string;
  title: string;
  rating: number;
  genre: string;
  runtimeMinutes: number;
  userRating?: number;   // Optional field for user ratings
}

// These are the filters (matching the API’s parameters).
export interface ShowFilter {
  titleContains?: string;
  isAdult?: string;       // Should be "TRUE" or "FALSE"
  genre?: string;
  startYearStart?: string;
  startYearEnd?: string;
  limit?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private apiUrl = 'http://localhost:8080/shows';

  constructor(private http: HttpClient) {}

  getShowCount(): Observable<number> {
    return this.http.get<{ COUNT: number }>(`${this.apiUrl}/count`).pipe(
      map(response => response.COUNT)
    );
  }

  getShows(filters?: ShowFilter): Observable<Show[]> {
    let params = new HttpParams();
    if (filters) {
      // Only add nonempty values.
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ShowFilter];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<RawShow[]>(this.apiUrl, { params }).pipe(
      map(rawShows =>
        rawShows.map(raw => {
          // Convert the nested avgRating object to a simple number.
          let rating = 0;
          if (raw.avgRating && raw.avgRating.Valid) {
            rating = raw.avgRating.Float64;
          }
          return {
            tconst: raw.tconst,
            // Use originalTitle (or raw.title) as the display title.
            title: raw.originalTitle,
            rating: rating,
            genre: raw.genres,
            runtimeMinutes: raw.runtimeMinutes
          } as Show;
        })

      )
    );
  }
}
