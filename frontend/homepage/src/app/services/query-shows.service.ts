// src/app/services/query-shows.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

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

// Basic show response from /shows/:id endpoint
export interface BasicShow {
  tconst: string;
  title: string;
  genres?: string;
  avgRating?: {
    Float64: number;
    Valid: boolean;
  };
  primaryTitle?: string;
  originalTitle?: string;
  runtimeMinutes?: number;
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

// These are the filters (matching the API's parameters).
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

  // Improved method to get a show by ID
  getShowById(id: string): Observable<Show> {
    // First try the direct endpoint
    return this.http
      .get<BasicShow>(`${this.apiUrl}/${id}`)
      .pipe(
        // If direct endpoint doesn't have all the data, fetch complete info
        switchMap((basicShow: BasicShow) => {
          // Create a simplified Show object with the info we have
          let rating = 0;
          if (basicShow.avgRating && basicShow.avgRating.Valid) {
            rating = basicShow.avgRating.Float64;
          }

          return of({
            tconst: basicShow.tconst,
            title: basicShow.title || basicShow.primaryTitle || basicShow.originalTitle || 'Unknown Show',
            rating: rating,
            // Remove genre and runtimeMinutes since they're not reliably returned
            genre: "",  // Empty string instead of actual genre
            runtimeMinutes: 0  // Default to 0 instead of actual runtime
          } as Show);
        }),
        catchError(error => {
          console.error(`Error fetching show ${id}:`, error);
          return of({
            tconst: id,
            title: "Unknown Show",
            rating: 0,
            genre: "",
            runtimeMinutes: 0
          } as Show);
        })
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
      map(rawShows => {
        // Check if rawShows is null or undefined before mapping
        if (!rawShows) {
          console.warn('Received null or undefined from API for shows');
          return [];
        }

        return rawShows.map(raw => {
          // Convert the nested avgRating object to a simple number.
          let rating = 0;
          if (raw.avgRating && raw.avgRating.Valid) {
            rating = raw.avgRating.Float64;
          }
          return {
            tconst: raw.tconst,
            title: raw.primaryTitle || raw.originalTitle || raw.title || '',
            rating: rating,
            genre: raw.genres || "N/A",
            runtimeMinutes: raw.runtimeMinutes || 0
          } as Show;
        });
      }),
      catchError(error => {
        console.error('Error fetching shows:', error);
        return of([]);
      })
    );
  }
}
