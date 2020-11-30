import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PasswordResetRoutingModule} from './password-reset-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {PasswordResetViewComponent} from './password-reset-view/password-reset-view.component';


@NgModule({
  declarations: [
    PasswordResetViewComponent
  ],
  imports: [
    CommonModule,
    PasswordResetRoutingModule,
    SharedModule
  ]
})
export class PasswordResetModule {
}
