import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {TestConfig} from './test/test.config';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        ...TestConfig.componentImports,
      ],
      providers: [
        ...TestConfig.providers,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
