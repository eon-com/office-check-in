import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AreasRoutingModule} from './areas-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {AddAreaViewComponent} from './add-area-view/add-area-view.component';
import {AreasViewComponent} from './areas-view/areas-view.component';
import {EditAreaViewComponent} from './edit-area-view/edit-area-view.component';
import {InviteAreaViewComponent} from './invite-area-view/invite-area-view.component';


@NgModule({
  declarations: [
    AddAreaViewComponent,
    AreasViewComponent,
    EditAreaViewComponent,
    InviteAreaViewComponent
  ],
  imports: [
    CommonModule,
    AreasRoutingModule,
    SharedModule
  ]
})
export class AreasModule {
}
