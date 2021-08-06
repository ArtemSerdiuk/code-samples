import { LoginPageComponent } from './login-page.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyEmptyComponent } from '@tigerq-frontend/core/mocks';
import {
  AuthCardModule,
  BackdropLoaderModule,
  CardModule,
  CommonSnackbarModule,
  CommonSnackbarService,
  CommonSnackbarServiceMock,
  ServerErrorFormValidatorModule,
} from '@tigerq-frontend/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@tigerq-frontend/admin/core/services/auth.service';
import { CurrentUserService } from '@tigerq-frontend/admin/core/services/current-user.service';
import { AuthServiceMock } from '@tigerq-frontend/admin/core/testing/auth-service.mock';
import { CurrentUserServiceMock } from '@tigerq-frontend/admin/core/testing/current-user-service.mock';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;

  const dashboardPageUrl: string = '/dashboard';
  const submitButtonSelector: string = '#submit-button';
  const emailInputQuerySelector = 'input[type="email"]';
  const passwordInputQuerySelector = 'input[type="password"]';
  const validEmail: string = '1234@gmail.com';
  const validPassword: string = '1234';
  const invalidEmail: string = 'invalid';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'auth/forgot-password', component: DummyEmptyComponent },
          { path: 'dashboard', component: DummyEmptyComponent },
        ]),
        BackdropLoaderModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        CardModule,
        AuthCardModule,
        CommonSnackbarModule,
        ServerErrorFormValidatorModule,
      ],
      declarations: [LoginPageComponent, DummyEmptyComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: CurrentUserService, useClass: CurrentUserServiceMock },
        {
          provide: CommonSnackbarService,
          useClass: CommonSnackbarServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form variable', () => {
    it('should not have instance when construction', () => {
      expect(component.form).toBeUndefined();
    });

    it('should have instance when Angular calls ngOnInit', () => {
      component.ngOnInit();
      expect(component.form).toBeTruthy();
    });
  });

  it('should NOT see backdrop loader errors when form is not submitting ', () => {
    component.isFormSubmitting = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#backdrop-loader'))).toBeNull();
  });

  it('should redirect to Forgot password page when click on "Send me reset password link', async(
    inject([Router, Location], (router: Router, location: Location) => {
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#forgot-password-link')).nativeElement.click();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/auth/forgot-password');
      });
    }),
  ));

  describe('isFormSubmitting variable', () => {
    it('should be falsy when construction', () => {
      expect(component.isFormSubmitting).toBeFalsy();
    });

    it('should be falsy when Angular calls ngOnInit', () => {
      component.ngOnInit();
      expect(component.isFormSubmitting).toBeFalsy();
    });
  });

  describe('emailFormControl getter', () => {
    it('should have instance when Angular calls ngOnInit', () => {
      fixture.detectChanges();
      expect(component.emailFormControl).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css(emailInputQuerySelector)).nativeElement;
      emailInput.value = '';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.emailFormControl.valid).toBeFalsy();
    });

    it('should be invalid when invalid email', () => {
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css(emailInputQuerySelector)).nativeElement;
      emailInput.value = invalidEmail;
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.emailFormControl.valid).toBeFalsy();
    });

    it('should be valid', () => {
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css(emailInputQuerySelector)).nativeElement;
      emailInput.value = validEmail;
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.emailFormControl.valid).toBeTruthy();
    });
  });

  describe('passwordFormControl getter', () => {
    it('should have instance when Angular calls ngOnInit', () => {
      component.ngOnInit();
      expect(component.passwordFormControl).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css(passwordInputQuerySelector)).nativeElement;
      emailInput.value = '';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.passwordFormControl.valid).toBeFalsy();
    });

    it('should be valid when not empty', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const emailInput = fixture.debugElement.query(By.css(passwordInputQuerySelector)).nativeElement;
      emailInput.value = '1';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.passwordFormControl.valid).toBeTruthy();
    });
  });

  describe('onSubmit method', () => {
    it('should be called when submit button clicked', () => {
      fixture.detectChanges();
      jest.spyOn(component, 'onSubmit');

      fixture.debugElement.query(By.css(submitButtonSelector)).nativeElement.click();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should set errors when login() return error', () => {
      fixture.detectChanges();

      expect(component.errors).toMatchObject({});

      component.emailFormControl.setValue(validEmail);
      component.passwordFormControl.setValue(validPassword);

      jest.spyOn(component._authService, 'login').mockReturnValue(throwError({ non_field_errors: [] }));
      fixture.debugElement.query(By.css(submitButtonSelector)).nativeElement.click();
      fixture.detectChanges();

      expect(component.errors).toHaveProperty('non_field_errors');
      expect(component.emailFormControl.valid).toBeFalsy();
      expect(component.passwordFormControl.valid).toBeFalsy();
    });

    it('should NOT call login() when form is invalid', () => {
      fixture.detectChanges();

      expect(component.errors).toMatchObject({});

      component.emailFormControl.setValue('');
      component.passwordFormControl.setValue('');

      jest.spyOn(component._authService, 'login');
      fixture.debugElement.query(By.css(submitButtonSelector)).nativeElement.click();
      fixture.detectChanges();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component._authService.login).not.toHaveBeenCalled();
    });

    it('should call login() when form is valid', () => {
      fixture.detectChanges();

      expect(component.errors).toMatchObject({});

      component.emailFormControl.setValue(validEmail);
      component.passwordFormControl.setValue(validPassword);

      jest.spyOn(component._authService, 'login');
      fixture.debugElement.query(By.css(submitButtonSelector)).nativeElement.click();
      fixture.detectChanges();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component._authService.login).toHaveBeenCalled();
    });

    it('should navigate to dashboard page when form is valid', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      fixture.detectChanges();
      component.emailFormControl.setValue(validEmail);
      component.passwordFormControl.setValue(validPassword);
      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith([dashboardPageUrl]);
    });
  });
});
