import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingsViewComponent} from './bookings-view.component';
import {TestConfig} from '../../../test/test.config';
import {BookingsService} from '../../../services/bookings.service';
import {BookingsServiceMock} from '../../../test/mock/bookings.service.mock';

describe('BookingViewComponent', () => {
  let component: BookingsViewComponent;
  let fixture: ComponentFixture<BookingsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsViewComponent],
      imports: [
        ...TestConfig.componentImports,
        ...TestConfig.customModules,
      ],
      providers: [
        ...TestConfig.providers,
        {
          provide: BookingsService, useClass: BookingsServiceMock,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
