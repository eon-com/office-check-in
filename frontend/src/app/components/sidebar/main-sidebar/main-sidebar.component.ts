import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Observable} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {AppUser} from '../../../models/user.model';
import {Navigation, NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainSidebarComponent implements OnInit {

  @HostBinding('class') clazz = 'main-sidebar';

  public user$: Observable<AppUser>;
  public Navigation = Navigation;

  constructor(
    public navigationService: NavigationService,
    public authService: AuthService,
    public userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.user$ = this.userService.getUserAsObservable(this.authService.firebaseUser);
  }

  public addBooking() {
    this.navigationService.go(Navigation.BOOKINGS_ADD);
  }

  public editUserProfile() {
    this.navigationService.go(Navigation.USER_PROFILE);
  }
}
