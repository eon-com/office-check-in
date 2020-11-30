import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JoinSidebarComponent} from './join-sidebar.component';
import {TestConfig} from '../../../test/test.config';
import {SidebarFooterComponent} from '../sidebar-footer/sidebar-footer.component';
import {LanguageSelectorModule} from '../../language-selector/language-selector.module';

describe('JoinSidebarComponent', () => {
  let component: JoinSidebarComponent;
  let fixture: ComponentFixture<JoinSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        JoinSidebarComponent,
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
    fixture = TestBed.createComponent(JoinSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
