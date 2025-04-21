import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import {
  ProfileService,
  UserProfile,
  WatchlistItem,
  RatingItem,
  CommentItem
} from './profileService.service';
import { AuthenticationService, User } from './authentication.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let authSpy: jasmine.SpyObj<AuthenticationService>;
  let httpMock: HttpTestingController;
  let userSubject: BehaviorSubject<User|null>;

  const mockUser: User = { id: 1, username: 'tester' };

  beforeEach(() => {
    userSubject = new BehaviorSubject<User|null>(null);
    authSpy = jasmine.createSpyObj(
      'AuthenticationService',
      [],
      {
        currentUserValue: mockUser,
        currentUser$:      userSubject.asObservable()
      }
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProfileService,
        { provide: AuthenticationService, useValue: authSpy }
      ]
    });

    service  = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load profile data when a user is logged in', () => {
    userSubject.next(mockUser);

    let loaded: UserProfile|null = null;
    service.profile$.subscribe(v => loaded = v);

    // watchlist request
    const wlReq = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://localhost:8080/watchlist' &&
      req.params.get('userID') === '1'
    );
    wlReq.flush([{ showID: 'tt123', status: 1 }] as WatchlistItem[]);

    // ratings request
    const rtReq = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://localhost:8080/ratings' &&
      req.params.get('userID') === '1'
    );
    rtReq.flush([{ showID: 'tt123', rating: 8 }] as RatingItem[]);

    // comments request
    const cmReq = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://localhost:8080/comments' &&
      req.params.get('userID') === '1'
    );
    cmReq.flush([{ commentID: 1, showID: 'tt123', comment: 'Great show' }] as CommentItem[]);

    expect(loaded!).toEqual({
      user:      mockUser,
      watchlist: [{ showID: 'tt123', status: 1 }],
      ratings:   [{ showID: 'tt123', rating: 8 }],
      comments:  [{ commentID: 1, showID: 'tt123', comment: 'Great show' }]
    } as UserProfile);
  });

  it('should handle slice errors and still emit defaults', () => {
    userSubject.next(mockUser);

    let loaded: UserProfile|null = null;
    service.profile$.subscribe(v => loaded = v);

    // watchlist fails
    httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://localhost:8080/watchlist' &&
      req.params.get('userID') === '1'
    ).error(new ErrorEvent('fail'));

    // ratings succeeds
    httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://localhost:8080/ratings' &&
      req.params.get('userID') === '1'
    ).flush([{ showID: 'x', rating: 5 }] as RatingItem[]);

    // comments fails
    httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://localhost:8080/comments' &&
      req.params.get('userID') === '1'
    ).error(new ErrorEvent('fail'));

    expect(loaded!).toEqual({
      user:      mockUser,
      watchlist: [],
      ratings:   [{ showID: 'x', rating: 5 }],
      comments:  []
    } as UserProfile);
  });
});
