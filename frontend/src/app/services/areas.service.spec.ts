import {TestBed} from '@angular/core/testing';

import {AreasService} from './areas.service';
import {TestConfig} from '../test/test.config';

describe('AreasService', () => {
  let service: AreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(AreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
