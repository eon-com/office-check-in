import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {DialogHelperService} from '../../../services/dialog-helper.service';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {fadeInAnimation} from 'src/app/animations/fade-in.animation';
import {Navigation, NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-password-reset-view',
  templateUrl: './password-reset-view.component.html',
  styleUrls: ['./password-reset-view.component.scss'],
  animations: [fadeInAnimation],
})
export class PasswordResetViewComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  private unsubscribe$ = new Subject<void>();

  public passwordResetForm: FormGroup;
  public readonly passwordResetBtnOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Reset Password',
    spinnerSize: 19,
    fullWidth: true,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogHelper: DialogHelperService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.translateService.stream('PASSWORD_RESET.FORM.BUTTONS.RESET.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(text => {
      this.passwordResetBtnOptions.text = text;
    });
  }

  async ngOnInit(): Promise<void> {
    this.passwordResetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get form() {
    return this.passwordResetForm.controls;
  }

  public async passwordReset() {
    if (this.passwordResetForm.invalid) {
      return;
    }

    this.passwordResetBtnOptions.active = true;

    try {
      await this.authService.passwordReset(this.form.email.value);

      const dialogRef = this.dialogHelper.showSuccessDialog({
        title: 'PASSWORD_RESET.SUCCESS.TITLE',
        message: 'PASSWORD_RESET.SUCCESS.MESSAGE',
      });

      dialogRef.afterClosed()
        .pipe(
          takeUntil(this.unsubscribe$),
        )
        .subscribe(
          data => {
            this.navigationService.go(Navigation.LOGIN);
          },
        );

    } catch (error) {
      console.error(error);
      let errorMessage = 'PASSWORD_RESET.ERRORS.UNKNOWN';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'PASSWORD_RESET.ERRORS.EMAIL_INVALID';
          break;
        default:
          break;
      }

      const dialogRef = this.dialogHelper.showErrorDialog({
        title: 'PASSWORD_RESET.ERRORS.TITLE',
        message: errorMessage,
      });
    } finally {
      this.passwordResetBtnOptions.active = false;
    }
  }
}
