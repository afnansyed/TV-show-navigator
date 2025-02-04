import { TestBed } from '@angular/core/testing';

import { QueryShowsService } from './query-shows.service';

describe('QueryShowsService', () => {
  let service: QueryShowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryShowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
