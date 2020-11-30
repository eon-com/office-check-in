import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomDatePickerComponent} from './custom-date-picker.component';
import {TestConfig} from '../../test/test.config';

describe('CustomDatePickerComponent', () => {
  let component: CustomDatePickerComponent;
  let fixture: ComponentFixture<CustomDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDatePickerComponent],
      imports: [
        ...TestConfig.componentImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
