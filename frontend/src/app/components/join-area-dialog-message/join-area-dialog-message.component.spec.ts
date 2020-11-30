import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JoinAreaDialogMessageComponent} from './join-area-dialog-message.component';
import {TestConfig} from '../../test/test.config';
import {Area} from '../../models/area.model';

describe('JoinAreaDialogMessageComponent', () => {
  let component: JoinAreaDialogMessageComponent;
  let fixture: ComponentFixture<JoinAreaDialogMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinAreaDialogMessageComponent],
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
    fixture = TestBed.createComponent(JoinAreaDialogMessageComponent);
    component = fixture.componentInstance;

    component.data = Area.deserialize({
      data: () => {
        return {
          id: 1,
          locationName: 'TestOffice',
          locationAddress: 'Hannover',
          creator: {
            id: 1,
          },
        };
      },
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
;
