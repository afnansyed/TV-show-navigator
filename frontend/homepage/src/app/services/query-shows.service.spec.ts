import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ShowService, RawShow, Show, ShowFilter } from './query-shows.service';

describe('ShowService', () => {
  let service: ShowService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // Provide the regular HttpClient
        provideHttpClient(),
        // Override it with the testing backend
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ShowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get show count and map the COUNT property', () => {
    const dummyResponse = { COUNT: 123 };

    service.getShowCount().subscribe(count => {
      expect(count).toBe(123);
    });

    const req = httpMock.expectOne('http://localhost:8080/shows/count');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should get shows without filters and correctly map raw data to Show objects', () => {
    const dummyRawShows: RawShow[] = [
      {
        tconst: 'tt1234567',
        primaryTitle: 'Primary Title',
        originalTitle: 'Original Title',
        isAdult: 0,
        genres: 'Drama,Thriller',
        startYear: 2020,
        endYear: 2021,
        runtimeMinutes: 45,
        avgRating: { Float64: 8.5, Valid: true },
        votes: { Int32: 1000, Valid: true },
        title: 'Original Title'
      }
    ];

    const expectedShows: Show[] = [
      {
        tconst: 'tt1234567',
        title: 'Original Title',
        rating: 8.5,
        genre: 'Drama,Thriller',
        runtimeMinutes: 45
      }
    ];

    service.getShows().subscribe(shows => {
      expect(shows).toEqual(expectedShows);
    });

    const req = httpMock.expectOne('http://localhost:8080/shows');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(dummyRawShows);
  });

  it('should append query parameters when filters are provided', () => {
    const filters: ShowFilter = {
      titleContains: 'fire',
      isAdult: 'TRUE',
      genre: 'romance',
      startYearStart: '2000',
      startYearEnd: '2020',
      limit: '20'
    };

    service.getShows(filters).subscribe();

    const req = httpMock.expectOne(req => req.url === 'http://localhost:8080/shows');
    expect(req.request.method).toBe('GET');

    expect(req.request.params.get('titleContains')).toBe('fire');
    expect(req.request.params.get('isAdult')).toBe('TRUE');
    expect(req.request.params.get('genre')).toBe('romance');
    expect(req.request.params.get('startYearStart')).toBe('2000');
    expect(req.request.params.get('startYearEnd')).toBe('2020');
    expect(req.request.params.get('limit')).toBe('20');

    req.flush([]);
  });
});
