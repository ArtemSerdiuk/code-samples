import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, take } from 'rxjs/operators';

import { ApiErrorResponseInterface } from '@tigerq-frontend/core/interfaces';
import { AuthService } from '@tigerq-frontend/admin/core/services/auth.service';
import {
  CommonValidationErrorMessageInterface,
  ReplayControlValueChanges,
  validationErrorMessages,
} from '@tigerq-frontend/helpers';
import { CurrentUserService } from '@tigerq-frontend/admin/core/services/current-user.service';

@UntilDestroy()
@Component({
  selector: 'tq-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  public errors: ApiErrorResponseInterface<string[]> = {};
  public readonly validationErrorMessages: CommonValidationErrorMessageInterface = validationErrorMessages;
  public isFormSubmitting: boolean = false;

  constructor(
    public readonly _formBuilder: FormBuilder,
    public readonly _authService: AuthService,
    public readonly _router: Router,
    public readonly _currentUserService: CurrentUserService,
  ) {}

  public get emailFormControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordFormControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public ngOnInit(): void {
    this._createForm();
  }

  public _createForm(): void {
    this.form = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.isFormSubmitting = true;
      const { email, password } = this.form.value;
      this._authService
        .login(email, password)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.isFormSubmitting = false)),
        )
        .subscribe(
          res => {
            this._currentUserService.setCurrentUser(res);
            this._router.navigate(['/dashboard']);
          },
          (errors: ApiErrorResponseInterface<string[]>) => {
            const error = { wrongCredentials: true };
            this.errors = errors;
            this.passwordFormControl.setErrors(error);
            this.emailFormControl.setErrors(error);

            new ReplayControlValueChanges(this.form, false).pipe(take(1), untilDestroyed(this)).subscribe(() => {
              this.emailFormControl.updateValueAndValidity();
              this.passwordFormControl.updateValueAndValidity();
              this.errors = {};
            });
          },
        );
    }
  }
}
