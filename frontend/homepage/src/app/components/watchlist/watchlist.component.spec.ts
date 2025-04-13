import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WatchlistComponent } from './watchlist.component';
import { AuthService, UserProfile } from '../../services/auth.service';
import { Show } from '../../services/query-shows.service';
import { BehaviorSubject, of } from 'rxjs';

// Fake AuthService implementation
class FakeAuthService {
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  setProfile(profile: UserProfile | null): void {
    this.userProfileSubject.next(profile);
  }

  getCurrentProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  removeShowFromWatchlist(show: Show): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      profile.watchlist = profile.watchlist.filter(s => s.tconst !== show.tconst);
      this.userProfileSubject.next(profile);
    }
  }

  rateShow(show: Show, rating: number): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      profile.ratings[show.tconst] = rating;
      this.userProfileSubject.next(profile);
    }
  }

  addComment(show: Show, comment: string): void {
    const profile = this.userProfileSubject.value;
    if (profile) {
      profile.comments[show.tconst] = [comment];
      this.userProfileSubject.next(profile);
    }
  }

  isInWatchlist(show: Show): boolean {
    const profile = this.userProfileSubject.value;
    return profile ? profile.watchlist.some(s => s.tconst === show.tconst) : false;
  }
}

describe('WatchlistComponent', () => {
  let component: WatchlistComponent;
  let fixture: ComponentFixture<WatchlistComponent>;
  let authService: FakeAuthService;

  // Dummy show for testing.
  const dummyShow: Show = {
    tconst: 'tt1234567',
    title: 'Test Show',
    rating: 7.5,
    genre: 'Drama',
    runtimeMinutes: 60,
    userRating: undefined
  };

  // Dummy profile with one show in the watchlist.
  const dummyProfile: UserProfile = {
    username: 'testuser',
    password: 'testpass',
    watchlist: [dummyShow],
    ratings: { [dummyShow.tconst]: 7 },
    comments: { [dummyShow.tconst]: ['Great show!'] }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, WatchlistComponent],
      providers: [{ provide: AuthService, useClass: FakeAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as FakeAuthService;
    fixture.detectChanges();
  });

  it('should update the watchlist when a profile is set', fakeAsync(() => {
    // Initially, the watchlist should be empty.
    expect(component.watchlist.length).toBe(0);

    // Set the profile using the fake auth service.
    authService.setProfile(dummyProfile);
    tick(); // Process the asynchronous emission
    fixture.detectChanges();

    // Now the watchlist should contain one show.
    expect(component.watchlist.length).toBe(1);
    expect(component.watchlist[0].title).toBe('Test Show');
  }));
});
