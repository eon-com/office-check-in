import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginViewComponent} from './login-view.component';
import {TestConfig} from '../../../test/test.config';
import {AuthService} from '../../../services/auth.service';
import {Navigation, NavigationService} from '../../../services/navigation.service';
import {ComponentTestingHelper} from '../../../shared/component-testing-helper';

describe('LoginComponent', () => {
  let cth: ComponentTestingHelper<LoginViewComponent>;

  let component: LoginViewComponent;
  let fixture: ComponentFixture<LoginViewComponent>;

  let isUserAuthenticated = false;

  const authServiceMock = jasmine.createSpyObj(['isAuthenticated', 'login', 'sendAccountVerificationEmail']);
  authServiceMock.isAuthenticated.and.returnValue(() => Promise.resolve(isUserAuthenticated));

  let navigationService: NavigationService;
  let navigationServiceGo;

  function loadComponent() {
    fixture = TestBed.createComponent(LoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    cth = new ComponentTestingHelper(fixture);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginViewComponent],
      imports: [
        ...TestConfig.componentImports,
        ...TestConfig.customModules,
      ],
      providers: [
        ...TestConfig.providers,
        {provide: AuthService, useValue: authServiceMock}
      ],
    });
    navigationService = TestBed.inject(NavigationService);
    navigationServiceGo = spyOn(navigationService, 'go');

  }));

  it('should create', () => {
    loadComponent();
    expect(component).toBeTruthy();
  });

  it('should redirect to Navigation.ROOT if already authenticated', fakeAsync(() => {
    isUserAuthenticated = true;
    loadComponent();
    tick(10);
    expect(navigationServiceGo).toHaveBeenCalledWith(Navigation.ROOT);
  }));

  it('should call authService.login when filling valid mail and password', fakeAsync(() => {
    loadComponent();

    cth.fillInputAndDispatchInputEvent('email', 'validmail@mail.com');
    cth.fillInputAndDispatchInputEvent('password', 'validpassword');

    isUserAuthenticated = true;

    component.login();
    tick(10);
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(navigationServiceGo).toHaveBeenCalledWith(Navigation.ROOT);
  }));

  it('form should be invalid when providing an invaild email', fakeAsync(() => {
    loadComponent();

    cth.fillInputAndDispatchInputEvent('email', 'invalidmail');
    cth.fillInputAndDispatchInputEvent('password', 'validpassword');

    expect(component.loginForm.invalid).toBeTrue();
  }));
});
