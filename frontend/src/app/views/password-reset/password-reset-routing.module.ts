import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PasswordResetSidebarComponent} from '../../components/sidebar/password-reset-sidebar/password-reset-sidebar.component';
import {PasswordResetViewComponent} from './password-reset-view/password-reset-view.component';


const routes: Routes = [
  {
    path: '',
    component: PasswordResetSidebarComponent,
    outlet: 'sidebar',
  },
  {
    path: '',
    component: PasswordResetViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordResetRoutingModule {
}
