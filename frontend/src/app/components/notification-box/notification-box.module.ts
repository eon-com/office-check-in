import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationBoxComponent} from './notification-box.component';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [NotificationBoxComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NotificationBoxComponent,
  ],
})
export class NotificationBoxModule {
}
