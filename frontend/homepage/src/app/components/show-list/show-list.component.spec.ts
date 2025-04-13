import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShowListComponent } from './show-list.component';
import { ShowService, Show, ShowFilter } from '../../services/query-shows.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ShowListComponent', () => {
  let component: ShowListComponent;
  let fixture: ComponentFixture<ShowListComponent>;
  let showServiceStub: Partial<ShowService>;
  let authServiceStub: Partial<AuthService>;
  let router: Router;

  // Dummy shows for testing.
  const dummyShows: Show[] = [
    { tconst: 'tt1234567', title: 'Test Show 1', rating: 7, genre: 'Drama', runtimeMinutes: 60 },
    { tconst: 'tt7654321', title: 'Test Show 2', rating: 8, genre: 'Comedy', runtimeMinutes: 30 }
  ];

  beforeEach(async () => {
    // Create stub for ShowService.
    showServiceStub = {
      getShows: (filters?: ShowFilter) => of(dummyShows)
    };

    // Create stub for AuthService with spies for watchlist methods.
    authServiceStub = {
      addShowToWatchlist: jasmine.createSpy('addShowToWatchlist'),
      removeShowFromWatchlist: jasmine.createSpy('removeShowFromWatchlist'),
      isInWatchlist: (show: Show) => false,
      userProfile$: of(null)
    };

    await TestBed.configureTestingModule({
      // Import RouterTestingModule and the standalone component.
      imports: [RouterTestingModule, ShowListComponent],
      providers: [
        { provide: ShowService, useValue: showServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowListComponent);
    component = fixture.componentInstance;
    // Inject Router from RouterTestingModule.
    router = TestBed.inject(Router);
    // Spy on router.navigate.
    spyOn(router, 'navigate');
    fixture.detectChanges(); // Trigger ngOnInit and loadShows()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load shows on init', () => {
    expect(component.shows).toEqual(dummyShows);
    expect(component.dataLength).toEqual(dummyShows.length);
  });

  it('should apply filters and call loadShows with the filter object', () => {
    spyOn(component, 'loadShows');
    // Set filter form values.
    component.filterForm.setValue({
      titleContains: 'Test',
      isAdult: '',
      genre: '',
      startYearStart: '',
      startYearEnd: '',
      limit: ''
    });
    const expectedFilters: ShowFilter = {
      titleContains: 'Test',
      isAdult: '',
      genre: '',
      startYearStart: '',
      startYearEnd: '',
      limit: ''
    };
    component.onFilterApply();
    expect(component.loadShows).toHaveBeenCalledWith(expectedFilters);
  });

  it('should clear filters and reload shows', () => {
    spyOn(component, 'loadShows');
    component.onFilterClear();
    expect(component.filterForm.value).toEqual({
      titleContains: null,
      isAdult: null,
      genre: null,
      startYearStart: null,
      startYearEnd: null,
      limit: null
    });
    expect(component.loadShows).toHaveBeenCalled();
  });

  it('should navigate to show details when onCardClick is called', () => {
    component.onCardClick(dummyShows[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/show-details', dummyShows[0].tconst]);
  });

  it('should call authService.addShowToWatchlist when toggleWatchlist is checked', () => {
    const event = { checked: true };
    component.toggleWatchlist(event, dummyShows[0]);
    expect(authServiceStub.addShowToWatchlist).toHaveBeenCalledWith(dummyShows[0]);
  });

  it('should call authService.removeShowFromWatchlist when toggleWatchlist is unchecked', () => {
    const event = { checked: false };
    component.toggleWatchlist(event, dummyShows[0]);
    expect(authServiceStub.removeShowFromWatchlist).toHaveBeenCalledWith(dummyShows[0]);
  });

  it('should navigate to /watchlist when openWatchlist is called', () => {
    component.openWatchlist();
    expect(router.navigate).toHaveBeenCalledWith(['/watchlist']);
  });

  it('should navigate to home when goHome is called', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
