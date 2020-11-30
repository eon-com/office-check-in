import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostBookingInfoViewComponent} from './post-booking-info-view.component';
import {TestConfig} from '../../../test/test.config';

describe('PostBookingInfoViewComponent', () => {
  let component: PostBookingInfoViewComponent;
  let fixture: ComponentFixture<PostBookingInfoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostBookingInfoViewComponent],
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
    fixture = TestBed.createComponent(PostBookingInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
