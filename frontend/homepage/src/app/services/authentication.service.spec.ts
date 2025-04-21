// src/app/services/authentication.service.spec.ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AuthenticationService, User, SignUpResponse, SignInResponse } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });

    service  = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    expect(service.currentUserValue).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  describe('signUp()', () => {
    it('should POST to /users then GET /validateUser and emit new User', fakeAsync(() => {
      const dummySignUp: SignUpResponse = { rowid: 0 }; // POST returns rowid but we ignore
      const dummyValidate: SignInResponse = { rowid: 123 };
      let result: User | undefined;

      service.signUp('alice', 'pw').subscribe(u => (result = u));

      // Expect POST /users
      const postReq = httpMock.expectOne(`${baseUrl}/users`);
      expect(postReq.request.method).toBe('POST');
      expect(postReq.request.body).toEqual({ username: 'alice', password: 'pw' });
      postReq.flush(dummySignUp, { status: 204, statusText: 'No Content' });

      // Then expect GET /validateUser
      const getReq = httpMock.expectOne(r =>
        r.url === `${baseUrl}/validateUser` &&
        r.params.get('username') === 'alice' &&
        r.params.get('password') === 'pw'
      );
      expect(getReq.request.method).toBe('GET');
      getReq.flush(dummyValidate);

      tick();

      // Resulting user
      expect(result).toEqual({ id: 123, username: 'alice' });

      // It should set localStorage
      const stored = JSON.parse(localStorage.getItem('currentUser')!);
      expect(stored).toEqual({ id: 123, username: 'alice' });

      // And currentUser$ should have emitted it
      expect(service.currentUserValue).toEqual({ id: 123, username: 'alice' });
      expect(service.isLoggedIn()).toBeTrue();
    }));
  });

  describe('signIn()', () => {
    it('should return true on successful validation, store user and emit', fakeAsync(() => {
      const dummyValidate: SignInResponse = { rowid: 77 };
      let loginResult: boolean | undefined;

      service.signIn('bob', 'secret').subscribe(ok => (loginResult = ok));

      const req = httpMock.expectOne(r =>
        r.url === `${baseUrl}/validateUser` &&
        r.params.get('username') === 'bob' &&
        r.params.get('password') === 'secret'
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyValidate);

      tick();

      expect(loginResult).toBeTrue();
      expect(service.currentUserValue).toEqual({ id: 77, username: 'bob' });
      expect(localStorage.getItem('currentUser')).toContain('"id":77');
      expect(service.isLoggedIn()).toBeTrue();
    }));

    it('should return false when rowid is 0 and not change state', fakeAsync(() => {
      const dummyValidate: SignInResponse = { rowid: 0 };
      let loginResult: boolean | undefined;

      service.signIn('bob', 'wrong').subscribe(ok => (loginResult = ok));

      const req = httpMock.expectOne(r =>
        r.url === `${baseUrl}/validateUser`
      );
      req.flush(dummyValidate);

      tick();

      expect(loginResult).toBeFalse();
      expect(service.currentUserValue).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.isLoggedIn()).toBeFalse();
    }));
  });

  it('logout() should clear user and localStorage', () => {
    // Seed a user
    (service as any).currentUserSubject.next({ id: 5, username: 'x' });
    localStorage.setItem('currentUser', JSON.stringify({ id: 5, username: 'x' }));

    service.logout();

    expect(service.currentUserValue).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
