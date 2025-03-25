import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';
import { Show } from './query-shows.service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  // A dummy show object to use in tests.
  const dummyShow: Show = {
    tconst: 'tt1234567',
    title: 'Test Show',
    rating: 8.5,
    genre: 'Drama,Thriller',
    runtimeMinutes: 45
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have an empty watchlist', (done: DoneFn) => {
    service.watchlist$.subscribe(watchlist => {
      expect(watchlist.length).toBe(0);
      done();
    });
  });

  it('should add a show to the watchlist', (done: DoneFn) => {
    service.addShow(dummyShow);
    service.watchlist$.subscribe(watchlist => {
      expect(watchlist.length).toBe(1);
      expect(watchlist[0]).toEqual(dummyShow);
      done();
    });
  });

  it('should not add duplicate shows', (done: DoneFn) => {
    service.addShow(dummyShow);
    service.addShow(dummyShow);
    service.watchlist$.subscribe(watchlist => {
      expect(watchlist.length).toBe(1);
      done();
    });
  });

  it('should remove a show from the watchlist', (done: DoneFn) => {
    service.addShow(dummyShow);
    service.removeShow(dummyShow);
    service.watchlist$.subscribe(watchlist => {
      expect(watchlist.length).toBe(0);
      done();
    });
  });

  it('should correctly identify if a show is in the watchlist', () => {
    // Initially, dummyShow should not be in the watchlist.
    expect(service.isInWatchlist(dummyShow)).toBeFalse();

    // After adding, it should be found.
    service.addShow(dummyShow);
    expect(service.isInWatchlist(dummyShow)).toBeTrue();
  });

  it('should handle adding a large number of shows', (done: DoneFn) => {
    const numShows = 1000; // Number of dummy shows for the pressure test
    const dummyShows: Show[] = [];

    // Generate dummy shows with unique tconst and title properties
    for (let i = 0; i < numShows; i++) {
      dummyShows.push({
        tconst: `tt${1000000 + i}`,
        title: `Test Show ${i}`,
        rating: 5 + (i % 5), // Arbitrary rating between 5 and 9
        genre: 'Test Genre',
        runtimeMinutes: 60
      });
    }

    // Add each dummy show to the watchlist
    dummyShows.forEach(show => service.addShow(show));

    // Subscribe to the watchlist observable and verify the length.
    service.watchlist$.subscribe(watchlist => {
      // When the watchlist length reaches the expected number, complete the test.
      if (watchlist.length === numShows) {
        expect(watchlist.length).toBe(numShows);
        done();
      }
    });
  });
});
