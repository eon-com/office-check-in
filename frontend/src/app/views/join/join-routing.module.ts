import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JoinSidebarComponent} from '../../components/sidebar/join-sidebar/join-sidebar.component';
import {JoinAreaViewComponent} from './join-area-view/join-area-view.component';


const routes: Routes = [
  {
    path: '',
    component: JoinSidebarComponent,
    outlet: 'sidebar',
  },
  {
    path: ':areaName',
    component: JoinAreaViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinRoutingModule { }
