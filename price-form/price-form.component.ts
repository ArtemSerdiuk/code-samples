import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NgControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  CommonValidationErrorMessageInterface,
  getAppendedValidators,
  isString,
  onlyFloatNumbersValidator,
  ReplayControlValueChanges,
  ValidationErrorType,
} from '@tigerq-frontend/helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { merge, Observable, of } from 'rxjs';
import { PriceRangeInterface } from '@tigerq-frontend/core/interfaces';
import { NullPriceRangeModel } from '@tigerq-frontend/core/models';
import { MaxLengthConstants, MaxValueConstants } from '@tigerq-frontend/core/constants';
import { PriceTypeEnum } from '@tigerq-frontend/core/enums';
import { CurrencyService } from '@tigerq-frontend/core/services';

@UntilDestroy()
@Component({
  selector: 'tq-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceFormComponent implements OnInit, OnDestroy, ControlValueAccessor {
  public formArray: FormArray = this._formBuilder.array([]);
  public onChange: (value: PriceRangeInterface[]) => PriceRangeInterface[];
  public onTouched: () => PriceRangeInterface[];
  public pricePerSample: string = 'Price per sample';
  public complexPrice: string = 'Simple target size';
  public min: number = 1;
  public lastToFormControlValue: number = 0;
  public oldStartValue: number = 0;
  public prefix: string = '';
  public isError: boolean = false;
  public isLastPriceRangeEndFieldFull: boolean = false;
  private _disabled: boolean = false;

  @Input() public priceType: PriceTypeEnum = PriceTypeEnum.simplePrice;
  @Input() public validationErrorMessages: CommonValidationErrorMessageInterface;
  @Input() public ValidationErrorType = ValidationErrorType;
  @Input() public isFormPriceLastItemNotNull: Observable<boolean> = of(false);

  @Input()
  public get value(): PriceRangeInterface[] {
    return this.formArray.getRawValue();
  }

  public set value(value: PriceRangeInterface[] | null) {
    this.patchForm(value || []);
  }

  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    public readonly _changeDetectorRef: ChangeDetectorRef,
    public readonly _formBuilder: FormBuilder,
    public readonly _currencyService: CurrencyService,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  public isShownAddPriceRange(index: number): boolean {
    return this.formArray.valid && !!this.formArray.controls[index].get('end').value;
  }

  public get getLastToFormControlValue(): number {
    return ++this.lastToFormControlValue;
  }

  public setToFormControlValue(index: number): void {
    if (this.formArray.controls[index]) {
      this.lastToFormControlValue = this.formArray.controls[index].get('end').value;
    }
  }

  public ngOnInit(): void {
    this.prefix = this._currencyService.getCurrencySymbol();

    this.ngControl.control.setValidators(getAppendedValidators(this.ngControl.control, this.validate.bind(this)));
    this.ngControl.control.updateValueAndValidity();

    new ReplayControlValueChanges(this.formArray)
      .pipe(
        untilDestroyed(this),
        filter(() => this.formArray.valid),
      )
      .subscribe(() => {
        this.onChange(this.value);
      });

    this.onFormControlValueChanges();
    this.onSubscribeErrors();
    this.onLastItemFormControlValueChanges();
  }

  public ngOnDestroy(): void {
    this.formArray.clear();
  }

  public writeValue(value: PriceRangeInterface[] | null): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: PriceRangeInterface[]) => PriceRangeInterface[]): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => PriceRangeInterface[]): void {
    this.onTouched = fn;
  }

  public patchForm(value: PriceRangeInterface[]): void {
    this.formArray.clear();

    if (!value.length) {
      this.formArray.insert(0, this.getFormGroup());
    } else {
      value.forEach((priceRange: PriceRangeInterface) => {
        this.formArray.push(this.getFormGroup(priceRange));
      });
    }
  }

  public onSubscribeErrors(): void {
    this.isFormPriceLastItemNotNull.pipe(untilDestroyed(this)).subscribe(res => {
      this.isError = res;
      this._changeDetectorRef.detectChanges();
    });
  }

  public onFormControlValueChanges(): void {
    this.checkLastItemValidation(this.formArray.controls.length - 1);

    const controlsArray$ = this.formArray.controls.map((control: AbstractControl, index: number) =>
      control.valueChanges.pipe(map(value => ({ index, control, data: value }))),
    );

    merge(...controlsArray$)
      .pipe(
        untilDestroyed(this),
        debounceTime(1000),
        map(data => {
          const start = data.control.get('start').value;
          const end = data.control.get('end').value;

          const value = isString(end) && !end.length ? null : end;

          if (value && this.formArray.controls[data.index]) {
            const newValue: number = parseInt(value, 10);

            if (newValue < start) {
              this.formArray.controls[data.index].get('end').patchValue(start, { emitEvent: false });
            } else if (newValue >= start) {
              this.formArray.controls[data.index].get('end').patchValue(+newValue, { emitEvent: false });
            }
          }
          return data;
        }),
        map(data => {
          const last = data.index === this.formArray.controls.length - 1;
          this.patchNextFromToControls(data.index, last);
          return data;
        }),
        distinctUntilChanged(),
      )
      .subscribe(data => {
        const last = data.index === this.formArray.controls.length - 1;

        if (last) {
          this.checkLastItemValidation(data.index);
          this.removeItemsBiggestThenMaxProductQuantity();
        } else {
          this.checkItemValidation(data.index);
        }
      });
  }

  public checkItemValidation(index: number): void {
    this.formArray.controls[index]
      .get('end')
      .setValidators([Validators.max(MaxValueConstants.productQuantity), Validators.pattern(/^[0-9]+([.][0-9]+)?$/)]);
  }

  public checkLastItemValidation(lastItemIndex: number): void {
    this.formArray.controls[lastItemIndex].get('end').clearValidators();
    this.formArray.controls[lastItemIndex]
      .get('end')
      .setValidators([Validators.max(MaxValueConstants.productQuantity), Validators.pattern(/^[0-9]+([.][0-9]+)?$/)]);
  }

  public removeItemsBiggestThenMaxProductQuantity(): void {
    this.formArray.controls = this.formArray.controls.filter(
      control => +control.get('start').value <= +MaxValueConstants.productQuantity,
    );
    this._changeDetectorRef.detectChanges();
  }

  public patchNextFromToControls(index: number, last: boolean): void {
    if (!last) {
      this.setToFormControlValue(index);
      const indexIncrement = ++index;
      if (this.formArray.controls[indexIncrement]) {
        const start = this.formArray.controls[indexIncrement].get('start').value;
        const end =
          this.formArray.controls[indexIncrement].get('end').value === ''
            ? null
            : this.formArray.controls[indexIncrement].get('end').value;
        const newValue: number = parseInt(end, 10);
        this.formArray.controls[indexIncrement].patchValue(
          {
            start: this.getLastToFormControlValue,
            end: newValue >= start ? newValue : start,
          },
          { emitEvent: false },
        );
        this.formArray.controls[indexIncrement].updateValueAndValidity();
      }
    }
  }

  public setPlaceholder(index: number): string {
    if (this.priceType === PriceTypeEnum.simplePrice) {
      return this.pricePerSample;
    } else if (this.priceType === PriceTypeEnum.complexPrice && index === 0) {
      return this.complexPrice;
    } else if (this.priceType === PriceTypeEnum.complexPrice && index > 0) {
      return 'Additional samples';
    }
  }

  public getFormGroup(data: PriceRangeInterface = new NullPriceRangeModel()): FormGroup {
    return this._formBuilder.group({
      title: [data.title, [Validators.required, Validators.maxLength(MaxLengthConstants.priceRangeTitle)]],
      start: [
        {
          value: data.start || this.getLastToFormControlValue,
          disabled: true,
        },
      ],
      end: [
        data.end || null,
        [Validators.max(MaxValueConstants.productQuantity), Validators.pattern(/^[0-9]+([.][0-9]+)?$/)],
      ],
      amount: [
        data.amount,
        [Validators.required, Validators.max(MaxValueConstants.productPrice), onlyFloatNumbersValidator],
      ],
    });
  }

  public validate(): ValidationErrors | null {
    setTimeout(() => {
      if (this.ngControl.control.touched) {
        this.formArray.markAllAsTouched();
        this._changeDetectorRef.markForCheck();
      }
    });

    return this.formArray.invalid ? { invalid: true } : null;
  }

  public isLastControlHasMaxProductQuantity(index: number): boolean {
    const start = +this.formArray.controls[index].get('start').value;
    const end = +this.formArray.controls[index].get('end').value;
    return start === MaxValueConstants.productQuantity || end >= MaxValueConstants.productQuantity;
  }

  public removeLastPriceRange(index: number): void {
    this.formArray.removeAt(index);
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onLastItemFormControlValueChanges(): void {
    const controlsArray$ = this.formArray.controls.map((control: AbstractControl, index: number) =>
      control.valueChanges.pipe(map(value => ({ index, control, data: value }))),
    );
    merge(...controlsArray$)
      .pipe(
        untilDestroyed(this),
        filter(data => {
          const lastIndex = this.formArray.controls.length - 1;
          return data.index === lastIndex;
        }),
      )
      .subscribe(data => {
        this.isLastPriceRangeEndFieldFull = !!data.data.end;
      });
  }

  public addPriceRange(index: number): void {
    let data = new NullPriceRangeModel();
    data = {
      ...data,
      title: null,
    };
    this.setToFormControlValue(index);
    this.formArray.push(this.getFormGroup(data));
    this.onFormControlValueChanges();
    this.onLastItemFormControlValueChanges();
  }

  public numberOnlyDecimals(event: KeyboardEvent): boolean {
    const pattern = /^[0-9]+([.][0-9]+)?$/;
    return pattern.test(event.key);
  }
}
