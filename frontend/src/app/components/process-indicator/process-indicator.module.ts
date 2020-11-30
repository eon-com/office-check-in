import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProcessIndicatorComponent} from './process-indicator.component';
import {NotificationBoxModule} from '../notification-box/notification-box.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    ProcessIndicatorComponent
  ],
  imports: [
    CommonModule,
    NotificationBoxModule,
    TranslateModule
  ],
  exports: [
    ProcessIndicatorComponent
  ]
})
export class ProcessIndicatorModule { }
