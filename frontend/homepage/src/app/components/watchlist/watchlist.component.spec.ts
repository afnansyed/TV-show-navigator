// src/app/components/watchlist/watchlist.component.spec.ts
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { WatchlistComponent } from './watchlist.component';
import { ProfileService, WatchlistItem } from '../../services/profileService.service';import { ShowService, Show } from '../../services/query-shows.service';
import { Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { NavbarComponent } from '../navbar/navbar.component';

describe('WatchlistComponent', () => {
  let component: WatchlistComponent;
  let fixture: ComponentFixture<WatchlistComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let router: Router;

  const mockProfile = {
    user: { id: 1, username: 'u' },
    watchlist: [{ showID: 'good', status: 1 }] as WatchlistItem[],
    ratings: [],
    comments: []
  };

  const goodShow: Show = {
    tconst: 'good',
    title: 'Good Show',
    rating: 5,
    genre: 'Drama',
    runtimeMinutes: 42
  };

  beforeEach(async () => {
    // 1) stub out ProfileService.profile$
    profileServiceSpy = jasmine.createSpyObj(
      'ProfileService',
      ['removeFromWatchlist', 'deleteRating', 'setRating', 'addComment', 'deleteComment'],
      { profile$: of(mockProfile) }
    );

    // 2) stub out ShowService.getShowById
    showServiceSpy = jasmine.createSpyObj('ShowService', ['getShowById']);
    showServiceSpy.getShowById.and.callFake(id =>
      id === 'good' ? of(goodShow) : throwError(() => new Error('404'))
    );

    // 3) stub out MatDialog (we don’t open any real dialogs in these tests)
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        ...MATERIAL_IMPORTS,
        NavbarComponent,
        WatchlistComponent   // ← standalone component in imports, not declarations
      ],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: ShowService,    useValue: showServiceSpy    },
        { provide: MatDialog,      useValue: dialogSpy         }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;

    // grab the Router from RouterTestingModule and spy on its navigate()
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit()
    tick();
    expect(component).toBeTruthy();
  }));

  it('should load shows and map to WatchlistShow', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.watchlist).toEqual([
      { tconst: 'good', title: 'Good Show', rating: 5 }
    ]);
    expect(component.isLoading).toBeFalse();
  }));

  it('goHome() should navigate to root', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('openShowList() should navigate to shows', () => {
    component.openShowList();
    expect(router.navigate).toHaveBeenCalledWith(['shows']);
  });

  describe('removeShow()', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should call removeFromWatchlist when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      profileServiceSpy.removeFromWatchlist.and.returnValue(of(void 0));

      component.removeShow({ tconst: 'good', title: 'Good Show', rating: 5 });
      expect(window.confirm)
        .toHaveBeenCalledWith('Remove "Good Show" from your watchlist?');
      expect(profileServiceSpy.removeFromWatchlist).toHaveBeenCalledWith('good');
    });

    it('should not call removeFromWatchlist when canceled', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.removeShow({ tconst: 'good', title: 'Good Show', rating: 5 });
      expect(profileServiceSpy.removeFromWatchlist).not.toHaveBeenCalled();
    });
  });
});
