import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainSidebarComponent} from './main-sidebar.component';
import {TestConfig} from '../../../test/test.config';
import {AuthService} from '../../../services/auth.service';
import {AuthServiceMock} from '../../../test/mock/auth.service.mock';
import {SidebarFooterComponent} from '../sidebar-footer/sidebar-footer.component';
import {LanguageSelectorModule} from '../../language-selector/language-selector.module';

describe('MainSidebarComponent', () => {
  let component: MainSidebarComponent;
  let fixture: ComponentFixture<MainSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainSidebarComponent,
        SidebarFooterComponent,
      ],
      imports: [
        ...TestConfig.componentImports,
        LanguageSelectorModule,
      ],
      providers: [
        ...TestConfig.providers,
        {
          provide: AuthService, useClass: AuthServiceMock,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
