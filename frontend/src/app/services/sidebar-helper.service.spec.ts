import {TestBed} from '@angular/core/testing';

import {SidebarHelperService} from './sidebar-helper.service';
import {TestConfig} from '../test/test.config';

describe('SidebarHelperService', () => {
  let service: SidebarHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(SidebarHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
