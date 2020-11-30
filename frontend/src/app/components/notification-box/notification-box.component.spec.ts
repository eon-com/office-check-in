import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationBoxComponent} from './notification-box.component';
import {TestConfig} from '../../test/test.config';

describe('NotificationBoxComponent', () => {
  let component: NotificationBoxComponent;
  let fixture: ComponentFixture<NotificationBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationBoxComponent],
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
    fixture = TestBed.createComponent(NotificationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
