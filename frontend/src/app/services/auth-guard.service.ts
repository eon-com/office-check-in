import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Navigation, NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private navigationService: NavigationService) {
  }

  async canActivate(): Promise<boolean> {
    const isAuthed = await this.auth.isAuthenticated();
    if (!isAuthed) {
      await this.navigationService.go(Navigation.LOGIN);
      return false;
    }
    return true;
  }
}
