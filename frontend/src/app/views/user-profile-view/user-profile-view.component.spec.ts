import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserProfileViewComponent} from './user-profile-view.component';
import {TestConfig} from '../../test/test.config';

describe('UserProfileViewComponent', () => {
  let component: UserProfileViewComponent;
  let fixture: ComponentFixture<UserProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileViewComponent],
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
    fixture = TestBed.createComponent(UserProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
