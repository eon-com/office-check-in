import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessIndicatorComponent } from './process-indicator.component';
import {TestConfig} from '../../test/test.config';
import {NotificationBoxModule} from '../notification-box/notification-box.module';

describe('ProcessIndicatorComponent', () => {
  let component: ProcessIndicatorComponent;
  let fixture: ComponentFixture<ProcessIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessIndicatorComponent ],
      imports: [
        ...TestConfig.componentImports,
        NotificationBoxModule
      ],
      providers: [
        ...TestConfig.providers,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
