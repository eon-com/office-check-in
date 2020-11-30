import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';
import {MainSidebarComponent} from './components/sidebar/main-sidebar/main-sidebar.component';
import {Navigation} from './services/navigation.service';

const routes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: MainSidebarComponent,
        outlet: 'sidebar',
      },
      {
        path: 'bookings',
        loadChildren: () => import('./views/bookings/bookings.module').then(m => m.BookingsModule),
      },
      {
        path: 'areas',
        loadChildren: () => import('./views/areas/areas.module').then(m => m.AreasModule)
      },
      {
        path: '**',
        redirectTo: Navigation.BOOKINGS,
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./views/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./views/password-reset/password-reset.module').then(m => m.PasswordResetModule)
  },
  {
    path: 'join',
    loadChildren: () => import('./views/join/join.module').then(m => m.JoinModule)
  },
  {
    path: '**',
    redirectTo: Navigation.BOOKINGS,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
