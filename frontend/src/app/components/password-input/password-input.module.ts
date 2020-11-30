import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordInputComponent} from './password-input.component';
import {MaterialModule} from '../material/material.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [PasswordInputComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    PasswordInputComponent
  ]
})
export class PasswordInputModule {
}
