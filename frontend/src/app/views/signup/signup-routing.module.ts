import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignupSidebarComponent} from '../../components/sidebar/signup-sidebar/signup-sidebar.component';
import {SignupSelectViewComponent} from './signup-select-view/signup-select-view.component';
import {SignupViewComponent} from './signup-view/signup-view.component';


const routes: Routes = [
  {
    path: '',
    component: SignupSidebarComponent,
    outlet: 'sidebar',
  },
  {
    path: '',
    component: SignupSelectViewComponent,
  },
  {
    path: 'member',
    component: SignupViewComponent,
    data: {
      signupType: 'member',
    },
  },
  {
    path: 'manager',
    component: SignupViewComponent,
    data: {
      signupType: 'manager',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
