import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignupSelectViewComponent} from './signup-select-view.component';
import {TestConfig} from '../../../test/test.config';

describe('SignupSelectViewComponent', () => {
  let component: SignupSelectViewComponent;
  let fixture: ComponentFixture<SignupSelectViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupSelectViewComponent],
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
    fixture = TestBed.createComponent(SignupSelectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
