import {LocalizedDatePipe} from './localized-date.pipe';
import {async, inject} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';

describe('LocalizedDatePipe', () => {
  let pipe: LocalizedDatePipe;

  beforeEach(async(inject([TranslateService], (translateService: TranslateService) => {
    pipe = new LocalizedDatePipe(translateService);
  })));
});
