import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JoinAreaViewComponent} from './join-area-view.component';
import {TestConfig} from '../../../test/test.config';

describe('JoinAreaViewComponent', () => {
  let component: JoinAreaViewComponent;
  let fixture: ComponentFixture<JoinAreaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinAreaViewComponent],
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
    fixture = TestBed.createComponent(JoinAreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
