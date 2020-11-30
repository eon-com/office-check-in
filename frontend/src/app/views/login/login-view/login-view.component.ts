import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, UserNotVerifiedError} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {DialogHelperService} from '../../../services/dialog-helper.service';
import {fadeInAnimation} from '../../../animations/fade-in.animation';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Navigation, NavigationService} from 'src/app/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss'],
  animations: [fadeInAnimation],
})
export class LoginViewComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  private unsubscribe$ = new Subject<void>();
  public Navigation = Navigation;

  public loginForm: FormGroup;
  public readonly loginBtnOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Login',
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
    private navigationService: NavigationService
  ) {
    this.translateService.stream('LOGIN.FORM.BUTTONS.LOGIN.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(text => {
      this.loginBtnOptions.text = text;
    });
  }

  async ngOnInit(): Promise<void> {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', Validators.required],
    });

    // Redirect to main page if already authenticated
    if (await this.authService.isAuthenticated()) {
      await this.navigationService.go(Navigation.ROOT);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get form() {
    return this.loginForm.controls;
  }

  public async login() {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      this.loginBtnOptions.active = true;

      await this.authService.login(this.form.email.value, this.form.password.value);

      window.setTimeout(async () => {
        const isAuthenticated = await this.authService.isAuthenticated();
        this.loginBtnOptions.active = false;
        if (isAuthenticated) {
          await this.navigationService.go(Navigation.BOOKINGS);
        }
      }, 0);
    } catch (error) {
      console.error(error);
      this.handleLoginError(error);
    } finally {
      this.loginBtnOptions.active = false;
    }
  }

  public handleLoginError(error) {
    const buttons = [{
      type: 'close',
    }] as any[];

    let errorMessage = 'LOGIN.ERRORS.UNKNOWN';
    if (error instanceof UserNotVerifiedError) {
      errorMessage = 'LOGIN.ERRORS.USER_NOT_VERIFIED';
      buttons.push({
        text: 'LOGIN.ERRORS.RESEND_EMAIL_VERIFICATION',
        click: () => {
          this.authService.sendAccountVerificationEmail(error.credential.user);
          this.dialogHelper.showSuccessDialog({
            title: 'LOGIN.RESEND_EMAIL_VERIFICATION_SUCCESS.TITLE',
            message: 'LOGIN.RESEND_EMAIL_VERIFICATION_SUCCESS.MESSAGE',
          });
        },
      });
    } else {
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'LOGIN.ERRORS.WRONG_CREDENTIALS';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'LOGIN.ERRORS.TOO_MANY_REQUESTS';
            break;
          default:
            break;
        }
      }
    }

    this.dialogHelper.showErrorDialog({
      title: 'LOGIN.ERRORS.TITLE',
      message: errorMessage,
      buttons,
    });
  }
}
