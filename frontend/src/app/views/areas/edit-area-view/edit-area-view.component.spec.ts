import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditAreaViewComponent} from './edit-area-view.component';
import {TestConfig} from '../../../test/test.config';

describe('EditAreaViewComponent', () => {
  let component: EditAreaViewComponent;
  let fixture: ComponentFixture<EditAreaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditAreaViewComponent],
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
    fixture = TestBed.createComponent(EditAreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
