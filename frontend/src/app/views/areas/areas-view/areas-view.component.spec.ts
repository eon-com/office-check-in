import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AreasViewComponent} from './areas-view.component';
import {TestConfig} from '../../../test/test.config';

describe('AreasViewComponent', () => {
  let component: AreasViewComponent;
  let fixture: ComponentFixture<AreasViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AreasViewComponent],
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
    fixture = TestBed.createComponent(AreasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
