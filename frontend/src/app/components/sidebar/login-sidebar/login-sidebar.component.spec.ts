import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginSidebarComponent} from './login-sidebar.component';
import {TestConfig} from '../../../test/test.config';
import {SidebarFooterComponent} from '../sidebar-footer/sidebar-footer.component';
import {LanguageSelectorModule} from '../../language-selector/language-selector.module';

describe('LoginSidebarComponent', () => {
  let component: LoginSidebarComponent;
  let fixture: ComponentFixture<LoginSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginSidebarComponent,
        SidebarFooterComponent,
      ],
      imports: [
        ...TestConfig.componentImports,
        LanguageSelectorModule,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
