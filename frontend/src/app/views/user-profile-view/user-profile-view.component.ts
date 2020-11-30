import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {AuthService} from '../../services/auth.service';
import {DialogHelperService} from '../../services/dialog-helper.service';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {fadeInAnimation} from 'src/app/animations/fade-in.animation';
import {UserService} from '../../services/user.service';
import {Navigation, NavigationService} from 'src/app/services/navigation.service';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss'],
  animations: [fadeInAnimation],
})
export class UserProfileViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  private unsubscribe$ = new Subject<void>();
  public Navigation = Navigation;

  public userProfileForm: FormGroup;
  public readonly saveBtnOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save changes',
    spinnerSize: 19,
    fullWidth: true,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
    type: 'submit',
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dialogHelper: DialogHelperService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.translateService.stream('COMMON.BUTTONS.SAVE_CHANGES')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(text => {
      this.saveBtnOptions.text = text;
    });
  }

  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser(this.authService.firebaseUser);

    this.userProfileForm = this.formBuilder.group({
      email: [{value: user.email, disabled: true}],
      firstname: [user.first_name, [
        Validators.pattern(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,()\[\]]{1,20}$/i),
      ]],
      lastname: [user.last_name, [
        Validators.pattern(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,()\[\]]{1,20}$/i),
      ]],
      dataPrivacy: [user.dataPrivacyAccepted, []],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get form() {
    return this.userProfileForm.controls;
  }

  public fieldIsInvalid(fieldname: string) {
    return this.form[fieldname].invalid && (this.form[fieldname].touched || this.form[fieldname].dirty);
  }

  public async save() {
    if (this.userProfileForm.invalid) {
      return;
    }

    this.saveBtnOptions.active = true;

    try {
      if (this.authService.firebaseUser) {
        await this.userService.updateUser(this.authService.firebaseUser, {
          first_name: this.form.firstname.value,
          last_name: this.form.lastname.value,
          dataPrivacyAccepted: this.form.dataPrivacy.value,
        });
      }

      this.dialogHelper.showSuccessDialog({
        title: 'USER_PROFILE.DIALOGS.SUCCESS.TITLE',
        message: 'USER_PROFILE.DIALOGS.SUCCESS.MESSAGE',
      });

    } catch (error) {
      console.error(error);

      const dialogRef = this.dialogHelper.showErrorDialog({
        title: 'USER_PROFILE.DIALOGS.ERROR.MESSAGE',
        message: 'USER_PROFILE.DIALOGS.ERROR.TITLE',
      });
    } finally {
      this.saveBtnOptions.active = false;
    }
  }
}
