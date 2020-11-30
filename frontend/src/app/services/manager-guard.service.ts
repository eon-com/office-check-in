import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {UserRolesService} from './user-roles.service';
import {Navigation, NavigationService} from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class ManagerGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private userRolesService: UserRolesService,
    private router: Router,
    private navigationService: NavigationService,
  ) {
  }

  public async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    const isAuthed = await this.auth.isAuthenticated();
    if (!isAuthed) {
      this.navigationService.go(Navigation.LOGIN);
      return false;
    }

    const isManager = await this.userRolesService.isManager(this.auth.firebaseUser.uid).toPromise();
    return isManager;
  }
}
