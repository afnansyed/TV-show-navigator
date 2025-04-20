// src/app/services/authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface SignUpResponse { rowid: number; }
export interface SignInResponse { rowid: number; }
export interface User { id: number; username: string; }

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private baseUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.currentUserSubject.next(JSON.parse(stored));
  }

  /** Sign up (POST /users) then immediately GET /validateUser to fetch rowid */
  signUp(username: string, password: string): Observable<User> {
    return this.http
      .post<SignUpResponse>(`${this.baseUrl}/users`, { username, password })
      .pipe(
        // after a 204, call /validateUser
        switchMap(() => {
          const params = new HttpParams().set('username', username).set('password', password);
          return this.http.get<SignInResponse>(`${this.baseUrl}/validateUser`, { params });
        }),
        map(res => {
          const user: User = { id: res.rowid, username };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  /** Sign in (GET /validateUser) */
  signIn(username: string, password: string): Observable<boolean> {
    const params = new HttpParams().set('username', username).set('password', password);

    return this.http
      .get<SignInResponse>(`${this.baseUrl}/validateUser`, { params })
      .pipe(
        map(res => {
          if (res.rowid) {
            const user: User = { id: res.rowid, username };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return true;
          }
          return false;
        })
      );
  }

  /** getter for the currently signed‑in User (or `null` if logged out) */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
