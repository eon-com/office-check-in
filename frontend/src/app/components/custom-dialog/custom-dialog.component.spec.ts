import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomDialogComponent} from './custom-dialog.component';
import {TestConfig} from '../../test/test.config';

describe('CustomDialogComponent', () => {
  let component: CustomDialogComponent;
  let fixture: ComponentFixture<CustomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDialogComponent],
      imports: [
        ...TestConfig.componentImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
