// src/app/components/show-list/show-list.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ShowListComponent } from './show-list.component';
import { ShowService } from '../../services/query-shows.service';
import { ProfileService } from '../../services/profileService.service';
import { MATERIAL_IMPORTS } from '../../material.imports';

describe('ShowListComponent', () => {
  let component: ShowListComponent;
  let fixture: ComponentFixture<ShowListComponent>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let router: Router;

  beforeEach(async () => {
    // Create spies for our injected services
    showServiceSpy = jasmine.createSpyObj('ShowService', ['getShows']);
    profileServiceSpy = jasmine.createSpyObj(
      'ProfileService',
      ['addToWatchlist', 'removeFromWatchlist', 'isInWatchlist'],
      { profile$: of({
          user: { id: 1, username: 'testuser' },
          watchlist: [],
          ratings: [],
          comments: []
        })
      }
    );

    // Stub methods
    showServiceSpy.getShows.and.returnValue(of([]));
    profileServiceSpy.addToWatchlist.and.returnValue(of(null));
    profileServiceSpy.removeFromWatchlist.and.returnValue(of(null));
    profileServiceSpy.isInWatchlist.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        NoopAnimationsModule,
        ...MATERIAL_IMPORTS,
        ShowListComponent // because it's standalone
      ],
      providers: [
        { provide: ShowService, useValue: showServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('should load shows on initialization', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(showServiceSpy.getShows).toHaveBeenCalledTimes(1);
    expect(component.shows).toEqual([]);
    expect(component.dataLength).toBe(0);
  }));

  it('should handle error when loading shows', fakeAsync(() => {
    showServiceSpy.getShows.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.loadShows();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error fetching shows:', jasmine.any(Error));
  }));

  it('should apply filters when form is submitted', () => {
    const filters = {
      titleContains: 'Foo',
      isAdult: 'TRUE',
      genre: 'Action',
      startYearStart: '2000',
      startYearEnd: '2005',
      limit: '10'
    };
    component.filterForm.setValue(filters);

    showServiceSpy.getShows.calls.reset();
    component.onFilterApply();

    expect(showServiceSpy.getShows).toHaveBeenCalledWith(filters);
  });

  it('should clear filters', fakeAsync(() => {
    component.filterForm.setValue({
      titleContains: 'Bar',
      isAdult: 'FALSE',
      genre: 'Drama',
      startYearStart: '1990',
      startYearEnd: '1999',
      limit: '5'
    });

    showServiceSpy.getShows.calls.reset();
    component.onFilterClear();
    tick();

    expect(component.filterForm.value).toEqual({
      titleContains: null,
      isAdult: null,
      genre: null,
      startYearStart: null,
      startYearEnd: null,
      limit: null
    });
    expect(showServiceSpy.getShows).toHaveBeenCalled();
  }));

  it('should navigate to show details on card click', () => {
    const fakeShow = { tconst: 'tt001' } as any;
    component.onCardClick(fakeShow);
    expect(router.navigate).toHaveBeenCalledWith(['/show-details', 'tt001']);
  });

  it('should add to watchlist', () => {
    const evt = { checked: true } as any;
    const fakeShow = { tconst: 'tt002' } as any;
    component.toggleWatchlist(evt, fakeShow);
    expect(profileServiceSpy.addToWatchlist).toHaveBeenCalledWith('tt002');
    expect(profileServiceSpy.removeFromWatchlist).not.toHaveBeenCalled();
  });

  it('should remove from watchlist', () => {
    const evt = { checked: false } as any;
    const fakeShow = { tconst: 'tt003' } as any;
    component.toggleWatchlist(evt, fakeShow);
    expect(profileServiceSpy.removeFromWatchlist).toHaveBeenCalledWith('tt003');
    expect(profileServiceSpy.addToWatchlist).not.toHaveBeenCalled();
  });

  it('should navigate to watchlist', () => {
    component.openWatchlist();
    expect(router.navigate).toHaveBeenCalledWith(['/watchlist']);
  });

  it('should navigate to home', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should unsubscribe on destroy', () => {
    const sub = jasmine.createSpyObj('sub', ['unsubscribe']);
    (component as any).profileSubscription = sub;
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});
