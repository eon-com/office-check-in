import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomDialogComponent, CustomDialogContentDirective} from './custom-dialog.component';
import {MaterialModule} from '../material/material.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    CustomDialogComponent,
    CustomDialogContentDirective,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [
    CustomDialogComponent,
  ],
})
export class CustomDialogModule {
}
