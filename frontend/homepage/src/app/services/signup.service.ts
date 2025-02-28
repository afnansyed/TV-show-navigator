import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
    private apiUrl = 'http://localhost:8080/users';
    constructor(private http: HttpClient) { }

  createUser(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }
}