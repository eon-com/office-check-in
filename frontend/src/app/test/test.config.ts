import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../components/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthMock, AngularFirestoreMock } from './mock/angularfire.mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { PageModule } from '../components/page/page.module';
import { CustomDialogModule } from '../components/custom-dialog/custom-dialog.module';
import { CustomDatePickerModule } from '../components/custom-date-picker/custom-date-picker.module';
import { CustomDateAdapter } from '../providers/custom-date-adapter.provider';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { LocalizedDatePipe } from '../pipes/localized-date/localized-date.pipe';
import { NotificationBoxModule } from '../components/notification-box/notification-box.module';
import { JoinAreaDialogMessageModule } from '../components/join-area-dialog-message/join-area-dialog-message.module';
import { LanguageSelectorModule } from '../components/language-selector/language-selector.module';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { AuthServiceMock } from './mock/auth.service.mock';
import { UserService } from '../services/user.service';
import { UserServiceMock } from './mock/user.service.mock';
import { ProcessIndicatorModule } from '../components/process-indicator/process-indicator.module';
import { AvatarModule } from '../components/avatar/avatar.module';
import { PasswordInputModule } from '../components/password-input/password-input.module';

export class TestConfig {
  public static get componentImports(): any[] {
    return [
      NoopAnimationsModule,
      CommonModule,
      MaterialModule,
      RouterTestingModule,
      ReactiveFormsModule,
      AngularFireModule.initializeApp(environment.firebase),
      TranslateModule.forRoot(),
      MatIconTestingModule,
      AvatarModule,
    ];
  }

  public static get customModules(): any[] {
    return [
      PageModule,
      CustomDialogModule,
      CustomDatePickerModule,
      NotificationBoxModule,
      JoinAreaDialogMessageModule,
      LanguageSelectorModule,
      ProcessIndicatorModule,
      PasswordInputModule
    ];
  }

  public static get serviceImports(): any[] {
    return [
      RouterTestingModule,
      TranslateModule.forRoot(),
      AngularFireModule.initializeApp(environment.firebase),
    ];
  }

  public static get providers(): any[] {
    return [
      {
        provide: AngularFirestore, useClass: AngularFirestoreMock,
      }, {
        provide: AngularFireAuth, useClass: AngularFireAuthMock,
      }, {
        provide: DateAdapter, useClass: CustomDateAdapter,
      }, {
        provide: AuthService, useClass: AuthServiceMock,
      }, {
        provide: UserService, useClass: UserServiceMock,
      },
      DatePipe,
      LocalizedDatePipe,
      {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
      {provide: MAT_SNACK_BAR_DATA, useValue: {}},
      {provide: MAT_DIALOG_DATA, useValue: {}},
      {provide: MatDialogRef, useValue: {}},
    ];
  }
}
