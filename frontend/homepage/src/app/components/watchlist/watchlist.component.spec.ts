import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchlistComponent } from './watchlist.component';
import { AuthService, UserProfile } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Show } from '../../services/query-shows.service';

// Create a fake AuthService to simulate user profile behavior.
class FakeAuthService {
  // Use a BehaviorSubject to simulate userProfile$
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  // Helper to set profile for testing.
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

  // Define a dummy show for testing.
  const dummyShow: Show = {
    tconst: 'tt1234567',
    title: 'Test Show',
    rating: 7.5,
    genre: 'Drama',
    runtimeMinutes: 60,
    userRating: undefined
  };

  // Create a dummy profile with one show in the watchlist, a rating, and a comment.
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an empty watchlist when no profile exists', () => {
    authService.setProfile(null);
    fixture.detectChanges();
    expect(component.watchlist.length).toBe(0);
  });

  it('should update the watchlist when a profile is set', () => {
    authService.setProfile(dummyProfile);
    fixture.detectChanges();
    expect(component.watchlist.length).toBe(1);
    expect(component.watchlist[0].title).toBe('Test Show');
  });

  it('should remove a show from the watchlist', () => {
    authService.setProfile(dummyProfile);
    fixture.detectChanges();
    component.removeShow(dummyShow);
    fixture.detectChanges();
    expect(component.watchlist.length).toBe(0);
  });

  it('should update user rating when updateUserRating is called', () => {
    authService.setProfile(dummyProfile);
    fixture.detectChanges();
    component.updateUserRating(dummyShow, { value: 9 });
    fixture.detectChanges();
    const profile = authService.getCurrentProfile();
    expect(profile?.ratings[dummyShow.tconst]).toBe(9);
  });

  it('should update comment when editComment is called', () => {
    authService.setProfile(dummyProfile);
    fixture.detectChanges();
    spyOn(window, 'prompt').and.returnValue('Awesome show!');
    component.editComment(dummyShow, { stopPropagation: () => {} });
    fixture.detectChanges();
    const profile = authService.getCurrentProfile();
    expect(profile?.comments[dummyShow.tconst][0]).toBe('Awesome show!');
  });

  it('should update rating when leaveOrEditRating is called', () => {
    authService.setProfile(dummyProfile);
    fixture.detectChanges();
    spyOn(window, 'prompt').and.returnValue('8');
    component.leaveOrEditRating(dummyShow, { stopPropagation: () => {} });
    fixture.detectChanges();
    const profile = authService.getCurrentProfile();
    expect(profile?.ratings[dummyShow.tconst]).toBe(8);
  });
});
