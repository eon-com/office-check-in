import {TestBed} from '@angular/core/testing';

import {DialogHelperService} from './dialog-helper.service';
import {TestConfig} from '../test/test.config';
import {MatDialogModule} from '@angular/material/dialog';

describe('DialogHelperService', () => {
  let service: DialogHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...TestConfig.serviceImports,
        MatDialogModule,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    });
    service = TestBed.inject(DialogHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
