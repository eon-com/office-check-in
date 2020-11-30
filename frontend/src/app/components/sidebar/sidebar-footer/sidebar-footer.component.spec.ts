import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SidebarFooterComponent} from './sidebar-footer.component';
import {TestConfig} from '../../../test/test.config';

describe('SidebarFooterComponent', () => {
  let component: SidebarFooterComponent;
  let fixture: ComponentFixture<SidebarFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarFooterComponent],
      imports: [
        ...TestConfig.componentImports,
        ...TestConfig.customModules
      ],
      providers: [
        ...TestConfig.providers,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
