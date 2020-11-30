import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LoginViewComponent} from './login-view/login-view.component';


@NgModule({
  declarations: [
    LoginViewComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule
  ]
})
export class LoginModule { }
