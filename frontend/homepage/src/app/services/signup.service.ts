import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface UserValidationResponse {
  rowid: number;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
    private apiUrl = 'http://localhost:8080/users';
    private validateUrl = 'http://localhost:8080/validateUser';
    constructor(private http: HttpClient) { }

  createUser(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }

  signIn(username: string, password: string): Observable<UserValidationResponse> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.get<UserValidationResponse>(this.validateUrl, { params });
  }
}
