import {TestBed} from '@angular/core/testing';

import {UserRolesService} from './user-roles.service';
import {TestConfig} from '../test/test.config';

describe('UserRolesService', () => {
  let service: UserRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(UserRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
