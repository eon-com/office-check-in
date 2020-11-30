import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordResetSidebarComponent} from './password-reset-sidebar.component';
import {TestConfig} from '../../../test/test.config';
import {SidebarFooterComponent} from '../sidebar-footer/sidebar-footer.component';
import {LanguageSelectorModule} from '../../language-selector/language-selector.module';

describe('PasswordResetSidebarComponent', () => {
  let component: PasswordResetSidebarComponent;
  let fixture: ComponentFixture<PasswordResetSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PasswordResetSidebarComponent,
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
    fixture = TestBed.createComponent(PasswordResetSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
