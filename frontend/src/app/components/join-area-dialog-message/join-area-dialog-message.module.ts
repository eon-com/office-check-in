import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JoinAreaDialogMessageComponent} from './join-area-dialog-message.component';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [JoinAreaDialogMessageComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
  ],
  exports: [
    JoinAreaDialogMessageComponent,
  ],
})
export class JoinAreaDialogMessageModule {
}
