import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NotificationBoxModule } from '../components/notification-box/notification-box.module';
import { AvatarModule } from '../components/avatar/avatar.module';
import { LanguageSelectorModule } from '../components/language-selector/language-selector.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../components/material/material.module';
import { PageModule } from '../components/page/page.module';
import { CustomDatePickerModule } from '../components/custom-date-picker/custom-date-picker.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomDialogModule } from '../components/custom-dialog/custom-dialog.module';
import { PipesModule } from '../pipes/pipes.module';
import { JoinAreaDialogMessageModule } from '../components/join-area-dialog-message/join-area-dialog-message.module';
import { ToastModule } from '../components/toast/toast.module';
import { ProcessIndicatorModule } from '../components/process-indicator/process-indicator.module';
import { PasswordInputModule } from '../components/password-input/password-input.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    ClipboardModule,
    NotificationBoxModule,
    AvatarModule,
    LanguageSelectorModule,
    TranslateModule,
    PageModule,
    CustomDatePickerModule,
    ReactiveFormsModule,
    RouterModule,
    CustomDialogModule,
    PipesModule,
    JoinAreaDialogMessageModule,
    ToastModule,
    ProcessIndicatorModule,
    PasswordInputModule
  ],
  exports: [
    HttpClientModule,
    ClipboardModule,
    NotificationBoxModule,
    AvatarModule,
    LanguageSelectorModule,
    TranslateModule,
    MaterialModule,
    PageModule,
    ReactiveFormsModule,
    PipesModule,
    CustomDatePickerModule,
    ProcessIndicatorModule,
    PasswordInputModule
  ]
})
export class SharedModule {
}
