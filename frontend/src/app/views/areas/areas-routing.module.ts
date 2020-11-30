import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AreasViewComponent} from './areas-view/areas-view.component';
import {AddAreaViewComponent} from './add-area-view/add-area-view.component';
import {ManagerGuardService} from '../../services/manager-guard.service';
import {EditAreaViewComponent} from './edit-area-view/edit-area-view.component';
import {InviteAreaViewComponent} from './invite-area-view/invite-area-view.component';


const routes: Routes = [
  {
    path: '',
    component: AreasViewComponent,
  },
  {
    path: 'add',
    component: AddAreaViewComponent,
    canActivate: [ManagerGuardService],
  },
  {
    path: 'edit/:areaId',
    component: EditAreaViewComponent,
    canActivate: [ManagerGuardService],
  },
  {
    path: 'invite/:areaId',
    component: InviteAreaViewComponent,
    canActivate: [ManagerGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreasRoutingModule { }
