import {TestBed} from '@angular/core/testing';

import {ManagerGuardService} from './manager-guard.service';
import {TestConfig} from '../test/test.config';

describe('ManagerGuardGuard', () => {
  let guard: ManagerGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    guard = TestBed.inject(ManagerGuardService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
