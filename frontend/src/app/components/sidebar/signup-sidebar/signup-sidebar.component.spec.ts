import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignupSidebarComponent} from './signup-sidebar.component';
import {TestConfig} from '../../../test/test.config';
import {SidebarFooterComponent} from '../sidebar-footer/sidebar-footer.component';
import {LanguageSelectorModule} from '../../language-selector/language-selector.module';

describe('SignupSidebarComponent', () => {
  let component: SignupSidebarComponent;
  let fixture: ComponentFixture<SignupSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignupSidebarComponent,
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
    fixture = TestBed.createComponent(SignupSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
