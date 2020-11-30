import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordResetViewComponent} from './password-reset-view.component';
import {TestConfig} from '../../../test/test.config';

describe('PasswordResetViewComponent', () => {
  let component: PasswordResetViewComponent;
  let fixture: ComponentFixture<PasswordResetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordResetViewComponent],
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
    fixture = TestBed.createComponent(PasswordResetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
