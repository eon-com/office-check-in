import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastComponent} from './toast.component';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [ToastComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [
    ToastComponent,
  ],
})
export class ToastModule {
}
