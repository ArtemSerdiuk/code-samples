import { ShippingAddressDialogComponent } from './shipping-address-dialog.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BackdropLoaderModule,
  ConfigFileValidationErrorDialogModule,
  CountryAutocompleteInputModule,
} from '@tigerq-frontend/shared';
import { MatDialogRefMock } from '@tigerq-frontend/core/mocks';
import { asyncData } from '@tigerq-frontend/helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

/* eslint-disable @typescript-eslint/unbound-method */
describe('ShippingAddressDialogComponent', () => {
  let component: ShippingAddressDialogComponent;
  let fixture: ComponentFixture<ShippingAddressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BackdropLoaderModule,
        CountryAutocompleteInputModule,
        ConfigFileValidationErrorDialogModule,
      ],
      declarations: [ShippingAddressDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useClass: MatDialogRefMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddressDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'getStaticData').mockImplementation(() => null);
    });

    it('should call getStaticData()', () => {
      expect(component.getStaticData).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component.getStaticData).toHaveBeenCalled();
    });
  });

  describe('closeDialog()', () => {
    it('should call _dialogRef.close()', () => {
      jest.spyOn(component._dialogRef, 'close');
      component.closeDialog();
      expect(component._dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('getStaticData()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'createForm').mockImplementation(() => null);
    });

    it('should define staticData', fakeAsync(() => {
      jest.spyOn(component._staticDataService, 'getData').mockReturnValue(asyncData(null));
      expect(component.staticData).toBeUndefined();
      component.getStaticData();
      tick();
      expect(component.staticData).toBeDefined();
    }));

    it('should isGetStaticDataProcess to be true when component._staticDataService() in progress', fakeAsync(() => {
      jest.spyOn(component._staticDataService, 'getData').mockReturnValue(asyncData(null));
      component.getStaticData();
      expect(component.isGetStaticDataProcess).toBe(true);
      tick();
      expect(component.isGetStaticDataProcess).toBe(false);
    }));

    it('should call createForm()', fakeAsync(() => {
      jest.spyOn(component._staticDataService, 'getData').mockReturnValue(asyncData(null));
      expect(component.createForm).not.toHaveBeenCalled();
      component.getStaticData();
      tick();
      expect(component.createForm).toHaveBeenCalled();
    }));
  });

  describe('createForm()', () => {
    it('should define form', fakeAsync(() => {
      jest.spyOn(component._staticDataService, 'getData').mockReturnValue(asyncData(null));
      component.getStaticData();
      tick();
      component.createForm();
      expect(component.form).toBeDefined();
    }));
  });

  describe('onSubmit()', () => {
    const getFromValidPropertySpy = () => jest.spyOn(component.form, 'valid', 'get');
    const getCountryFormControlTouched = () => jest.spyOn(component.countryFormControl, 'markAsTouched');
    const getCountryFormControlUpdateValueAndValidity = () =>
      jest.spyOn(component.countryFormControl, 'updateValueAndValidity');

    beforeEach(() => {
      component.form = new FormGroup({});
      jest.spyOn(component._dialogRef, 'close').mockImplementation(() => null);
      jest.spyOn(component, 'countryFormControl', 'get').mockImplementation(() => new FormControl(null));
    });

    it('should call _dialogRef.close() when form is invalid ', () => {
      getCountryFormControlTouched();
      getCountryFormControlUpdateValueAndValidity();
      getFromValidPropertySpy().mockReturnValue(true);
      component.onSubmit();
      expect(component._dialogRef.close).toHaveBeenCalled();
    });

    it('should NOT call _dialogRef.close() when form is invalid ', () => {
      getCountryFormControlTouched();
      getCountryFormControlUpdateValueAndValidity();
      getFromValidPropertySpy().mockReturnValue(false);
      component.onSubmit();
      expect(component._dialogRef.close).not.toHaveBeenCalled();
    });
  });
});
