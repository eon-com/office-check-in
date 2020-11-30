import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddBookingViewComponent} from './add-booking-view.component';
import {TestConfig} from '../../../test/test.config';

describe('AddBookingViewComponent', () => {
  let component: AddBookingViewComponent;
  let fixture: ComponentFixture<AddBookingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookingViewComponent],
      imports: [
        ...TestConfig.componentImports,
        ...TestConfig.customModules,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
