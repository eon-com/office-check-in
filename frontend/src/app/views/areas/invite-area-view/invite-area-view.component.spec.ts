import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InviteAreaViewComponent} from './invite-area-view.component';
import {TestConfig} from '../../../test/test.config';

describe('InviteAreaViewComponent', () => {
  let component: InviteAreaViewComponent;
  let fixture: ComponentFixture<InviteAreaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InviteAreaViewComponent],
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
    fixture = TestBed.createComponent(InviteAreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
