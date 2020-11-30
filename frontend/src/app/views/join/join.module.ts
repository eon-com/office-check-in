import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinRoutingModule } from './join-routing.module';
import {JoinAreaViewComponent} from './join-area-view/join-area-view.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    JoinAreaViewComponent
  ],
  imports: [
    CommonModule,
    JoinRoutingModule,
    SharedModule
  ]
})
export class JoinModule { }
