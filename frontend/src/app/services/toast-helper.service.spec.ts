import {TestBed} from '@angular/core/testing';

import {ToastHelperService} from './toast-helper.service';
import {TestConfig} from '../test/test.config';

describe('ToastHelperService', () => {
  let service: ToastHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.componentImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(ToastHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
