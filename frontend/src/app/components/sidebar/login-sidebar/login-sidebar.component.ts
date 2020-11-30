import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-login-sidebar',
  templateUrl: './login-sidebar.component.html',
  styleUrls: ['./login-sidebar.component.scss']
})
export class LoginSidebarComponent implements OnInit {

  constructor(public navigationService: NavigationService) {
  }

  ngOnInit(): void {
  }

}
