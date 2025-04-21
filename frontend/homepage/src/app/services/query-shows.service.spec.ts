// src/app/services/query-shows.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ShowService,
  Show,
  ShowFilter,
  RawShow,
  BasicShow
} from './query-shows.service';  // Fixed the hyphen character

describe('ShowService', () => {
  let service: ShowService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ShowService ]
    });

    service  = TestBed.inject(ShowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getShowCount() should fetch and map COUNT', () => {
    let count = 0;
    service.getShowCount().subscribe((c: number) => count = c);

    const req = httpMock.expectOne('http://localhost:8080/shows/count');
    expect(req.request.method).toBe('GET');
    req.flush({ COUNT: 42 });

    expect(count).toBe(42);
  });

  it('getShowById() should return a simplified Show', () => {
    const basic: BasicShow = {
      tconst: 'tt1',
      title: 'T1',
      avgRating: { Float64: 7.2, Valid: true }
    };
    let out: Show|null = null;
    service.getShowById('tt1').subscribe((s: Show) => out = s);

    const req = httpMock.expectOne('http://localhost:8080/shows/tt1');
    expect(req.request.method).toBe('GET');
    req.flush(basic);

    expect(out!).toEqual({
      tconst: 'tt1',
      title:  'T1',
      rating: 7.2,
      genre:  '',
      runtimeMinutes: 0
    } as Show);
  });

  it('getShowById() on error should return Unknown Show', () => {
    let out: Show|null = null;
    service.getShowById('nope').subscribe((s: Show) => out = s);

    const req = httpMock.expectOne('http://localhost:8080/shows/nope');
    req.error(new ErrorEvent('fail'));

    expect(out!).toEqual({
      tconst: 'nope',
      title:  'Unknown Show',
      rating: 0,
      genre:  '',
      runtimeMinutes: 0
    } as Show);
  });

  describe('getShows()', () => {
    const raw: RawShow[] = [{
      tconst: 'abc',
      primaryTitle: 'P',
      originalTitle: 'O',
      isAdult: 0,
      genres: 'Drama',
      startYear: 2000,
      endYear: 0,
      runtimeMinutes: 100,
      avgRating: { Float64: 9, Valid: true },
      votes:     { Int32: 1000, Valid: true },
      title: ''
    }];

    it('should fetch list without params', () => {
      let out: Show[] = [];
      service.getShows().subscribe((arr: Show[]) => out = arr);

      const req = httpMock.expectOne(r =>
        r.method === 'GET' &&
        r.url === 'http://localhost:8080/shows' &&
        r.params.keys().length === 0
      );
      req.flush(raw);

      expect(out).toEqual([{
        tconst: 'abc',
        title:  'P',
        rating: 9,
        genre:  'Drama',
        runtimeMinutes: 100
      } as Show]);
    });

    it('should include only non-empty filter params', () => {
      const filters: ShowFilter = {
        titleContains: 'foo',
        genre:         'Action',
        limit:         '5'
      };

      let out: Show[] = [];
      service.getShows(filters).subscribe((arr: Show[]) => out = arr);

      const req = httpMock.expectOne(r =>
        r.method === 'GET' &&
        r.url === 'http://localhost:8080/shows' &&
        r.params.get('titleContains') === 'foo' &&
        r.params.get('genre')         === 'Action' &&
        r.params.get('limit')         === '5'
      );
      req.flush(raw);

      expect(out.length).toBe(1);
    });

    it('should return empty array on error', () => {
      let out: Show[] = [{ tconst: '', title: '', rating: -1, genre: '', runtimeMinutes: 0 }];
      service.getShows().subscribe((arr: Show[]) => out = arr);

      const req = httpMock.expectOne('http://localhost:8080/shows');
      req.error(new ErrorEvent('fail'));

      expect(out).toEqual([]);
    });
  });
});
