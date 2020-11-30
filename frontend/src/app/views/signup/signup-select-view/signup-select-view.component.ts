import {Component, OnInit} from '@angular/core';
import {Navigation, NavigationService} from '../../../services/navigation.service';
import {DialogHelperService} from '../../../services/dialog-helper.service';

@Component({
  selector: 'app-signup-select-view',
  templateUrl: './signup-select-view.component.html',
  styleUrls: ['./signup-select-view.component.scss'],
})
export class SignupSelectViewComponent implements OnInit {

  public Navigation = Navigation;

  constructor(
    private dialogService: DialogHelperService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit(): void {
  }

  public showHint($event: Event, type: string) {
    $event.preventDefault();
    $event.stopPropagation();

    this.dialogService.showInfoDialog(type === 'member' ? {
      title: 'SIGNUP_SELECT.DIALOGS.HINT.MEMBER.TITLE',
      message: 'SIGNUP_SELECT.DIALOGS.HINT.MEMBER.MESSAGE',
    } : {
      title: 'SIGNUP_SELECT.DIALOGS.HINT.MANAGER.TITLE',
      message: 'SIGNUP_SELECT.DIALOGS.HINT.MANAGER.MESSAGE',
    });
  }
}
