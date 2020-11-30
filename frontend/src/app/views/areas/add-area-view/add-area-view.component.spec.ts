import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddAreaViewComponent} from './add-area-view.component';
import {TestConfig} from '../../../test/test.config';

describe('AddAreaViewComponent', () => {
  let component: AddAreaViewComponent;
  let fixture: ComponentFixture<AddAreaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAreaViewComponent],
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
    fixture = TestBed.createComponent(AddAreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
