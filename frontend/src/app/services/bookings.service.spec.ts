import {TestBed} from '@angular/core/testing';

import {BookingsService} from './bookings.service';
import {TestConfig} from '../test/test.config';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(BookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
