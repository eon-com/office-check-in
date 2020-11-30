import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSidebarComponent } from '../../components/sidebar/login-sidebar/login-sidebar.component';
import { LoginViewComponent } from './login-view/login-view.component';


const routes: Routes = [
  {
    path: '',
    component: LoginSidebarComponent,
    outlet: 'sidebar',
  },
  {
    path: '',
    component: LoginViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
