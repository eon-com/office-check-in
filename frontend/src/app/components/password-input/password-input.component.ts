import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ValidatorFn, Validators} from '@angular/forms';
import {DialogHelperService} from '../../services/dialog-helper.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  private initial = '';
  private unsubscribe$ = new Subject<void>();

  public passwordFormGroup: FormGroup;

  public changed: (_: any) => {};

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.passwordFormGroup = this.formBuilder.group({
      password: [
        this.initial,
        [
          Validators.required,
          Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@;:.,\-_$!%*?&§=+#"'\\\/()\[\]]).{8,}$/))
        ],
      ],
      passwordConfirmation: [
        this.initial,
        [
          Validators.required,
          Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@;:.,\-_$!%*?&§=+#"'\\\/()\[\]]).{8,}$/))
        ],
      ],
    }, [
      MustMatch('password', 'passwordConfirmation'),
    ]);
    this.passwordFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(_ => {
      this.check();
    });
  }

  public fieldIsInvalid(fieldname: string) {
    return this.passwordFormGroup.controls[fieldname].invalid &&
      (this.passwordFormGroup.controls[fieldname].touched || this.passwordFormGroup.controls[fieldname].dirty);
  }

  registerOnChange(fn: any): void {
    this.changed = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: any): void {
    this.initial = value;
  }

  check() {
    if (this.passwordFormGroup.valid) {
      this.changed(this.passwordFormGroup.controls.password.value);
    } else {
      this.changed('');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mustMatch: true});
    } else {
      matchingControl.setErrors(null);
    }
  };
}
