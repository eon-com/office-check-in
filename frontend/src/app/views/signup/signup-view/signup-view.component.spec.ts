import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignupViewComponent} from './signup-view.component';
import {TestConfig} from '../../../test/test.config';

describe('SignupComponent', () => {
  let component: SignupViewComponent;
  let fixture: ComponentFixture<SignupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupViewComponent ],
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
    fixture = TestBed.createComponent(SignupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
