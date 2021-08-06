import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StaticDataInterface } from '@tigerq-frontend/core/interfaces';
import {
  CommonValidationErrorMessageInterface,
  trimValidator,
  validationErrorMessages,
  ValidationErrorType,
} from '@tigerq-frontend/helpers';
import { StaticDataService } from '@tigerq-frontend/core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MaxLengthConstants, MinLengthConstants } from '@tigerq-frontend/core/constants';

@UntilDestroy()
@Component({
  selector: 'tq-shipping-address-dialog',
  templateUrl: './shipping-address-dialog.component.html',
  styleUrls: ['./shipping-address-dialog.component.scss'],
})
export class ShippingAddressDialogComponent implements OnInit {
  public isFormSubmitting: boolean = false;
  public readonly validationErrorMessages: CommonValidationErrorMessageInterface = validationErrorMessages;
  public readonly ValidationErrorType = ValidationErrorType;
  public form: FormGroup;
  public staticData: StaticDataInterface;
  public isGetStaticDataProcess: boolean = true;

  constructor(
    public readonly _dialogRef: MatDialogRef<ShippingAddressDialogComponent>,
    public readonly _staticDataService: StaticDataService,
    public readonly _formBuilder: FormBuilder,
  ) {}

  public ngOnInit(): void {
    this.getStaticData();
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }

  public get zipCodeFormControl(): FormControl {
    return this.form.get('zip_code') as FormControl;
  }

  public get countryFormControl(): FormControl {
    return this.form.get('country') as FormControl;
  }

  public get cityFormControl(): FormControl {
    return this.form.get('city') as FormControl;
  }

  public get streetFormControl(): FormControl {
    return this.form.get('street') as FormControl;
  }

  public getStaticData(): void {
    this.isGetStaticDataProcess = true;
    this._staticDataService
      .getData()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.staticData = res;
        this.createForm();
        this.isGetStaticDataProcess = false;
      });
  }

  public createForm(): void {
    this.form = this._formBuilder.group({
      zip_code: [
        null,
        [
          Validators.required,
          Validators.maxLength(MaxLengthConstants.zipCode),
          Validators.minLength(MinLengthConstants.zipCode),
          trimValidator,
        ],
      ],
      country: [null, [Validators.required]],
      city: [null, [Validators.required, Validators.maxLength(MaxLengthConstants.city), trimValidator]],
      street: [null, [Validators.required, Validators.maxLength(MaxLengthConstants.street), trimValidator]],
    });
  }

  public onSubmit(): void {
    this.countryFormControl.markAsTouched();
    this.countryFormControl.updateValueAndValidity();

    if (this.form.valid) {
      this._dialogRef.close(this.form.value);
    }
  }
}
