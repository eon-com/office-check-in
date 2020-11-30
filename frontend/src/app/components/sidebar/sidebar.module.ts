import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinSidebarComponent } from './join-sidebar/join-sidebar.component';
import { LoginSidebarComponent } from './login-sidebar/login-sidebar.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { SignupSidebarComponent } from './signup-sidebar/signup-sidebar.component';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { CloseSidebarDirective } from './close-sidebar.directive';
import { RouterModule } from '@angular/router';
import { PasswordResetSidebarComponent } from './password-reset-sidebar/password-reset-sidebar.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    JoinSidebarComponent,
    LoginSidebarComponent,
    MainSidebarComponent,
    SignupSidebarComponent,
    SidebarFooterComponent,
    PasswordResetSidebarComponent,
    CloseSidebarDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    JoinSidebarComponent,
    LoginSidebarComponent,
    MainSidebarComponent,
    SignupSidebarComponent,
    SidebarFooterComponent,
    PasswordResetSidebarComponent,
    CloseSidebarDirective
  ],
})
export class SidebarModule {
}
