import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AvatarComponent} from './avatar.component';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [AvatarComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    AvatarComponent,
  ],
})
export class AvatarModule {
}
