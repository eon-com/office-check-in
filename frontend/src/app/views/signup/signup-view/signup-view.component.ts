import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {fadeInAnimation} from '../../../animations/fade-in.animation';
import {DialogHelperService} from '../../../services/dialog-helper.service';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {Navigation, NavigationService} from 'src/app/services/navigation.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-view.component.html',
  styleUrls: ['./signup-view.component.scss'],
  animations: [fadeInAnimation],
})
export class SignupViewComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  private unsubscribe$ = new Subject<void>();
  public Navigation = Navigation;

  public signupForm: FormGroup;
  public signupType: string;
  public readonly signupBtnOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Register',
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
    private dialogHelper: DialogHelperService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.translateService.stream('SIGNUP.FORM.BUTTONS.SIGNUP.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(text => {
      this.signupBtnOptions.text = text;
    });

    this.activatedRoute.data
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(routeData => {
        this.signupType = routeData.signupType;
      },
    );
  }

  ngOnInit(): void {
    const signupFormControlsConfig: any = {
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [Validators.required]]
    };

    this.activatedRoute.data
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(routeData => {
        if (routeData.signupType === 'manager') {
          signupFormControlsConfig.teamname = ['', [
            Validators.required,
          ]];
          signupFormControlsConfig.teamrole = ['', [
            Validators.required,
          ]];
        }

        this.signupForm = this.formBuilder.group(signupFormControlsConfig);
      },
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get form() {
    return this.signupForm.controls;
  }

  public fieldIsInvalid(fieldname: string) {
    return this.form[fieldname].invalid && (this.form[fieldname].touched || this.form[fieldname].dirty);
  }

  public async signup() {
    if (this.signupForm.invalid) {
      return;
    }

    this.signupBtnOptions.active = true;

    try {
      const result = await this.authService.signup({
        email: this.form.email.value,
        password: this.form.password.value,
        teamname: this.form.teamname?.value,
        teamrole: this.form.teamrole?.value,
      });
      let dialogRef;

      if (result == null) {
        dialogRef = this.dialogHelper.showErrorDialog({
          title: 'SIGNUP.ERRORS.TITLE',
          message: 'SIGNUP.ERRORS.UNKNOWN',
        });
      } else {
        dialogRef = this.dialogHelper.showSuccessDialog({
          title: 'SIGNUP.SUCCESS.TITLE',
          message: 'SIGNUP.SUCCESS.MESSAGE',
        });
      }

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
      let errorMessage = 'SIGNUP.ERRORS.UNKNOWN';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'SIGNUP.ERRORS.EMAIL_IN_USE';
          break;
        case 'auth/invalid-email':
          errorMessage = 'SIGNUP.ERRORS.EMAIL_INVALID';
          break;
        case 'auth/weak-password':
          errorMessage = 'SIGNUP.ERRORS.PASSWORD_TOO_WEAK';
          break;
        default:
          break;
      }

      const dialogRef = this.dialogHelper.showErrorDialog({
        title: 'SIGNUP.ERRORS.TITLE',
        message: errorMessage,
      });
    } finally {
      this.signupBtnOptions.active = false;
    }
  }
}

