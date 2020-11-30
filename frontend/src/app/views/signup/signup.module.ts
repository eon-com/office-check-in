import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import {SignupSelectViewComponent} from './signup-select-view/signup-select-view.component';
import {SignupViewComponent} from './signup-view/signup-view.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    SignupSelectViewComponent,
    SignupViewComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    SharedModule
  ]
})
export class SignupModule { }
