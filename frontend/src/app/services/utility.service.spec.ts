import {TestBed} from '@angular/core/testing';

import {UtilityService} from './utility.service';
import {TestConfig} from '../test/test.config';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
