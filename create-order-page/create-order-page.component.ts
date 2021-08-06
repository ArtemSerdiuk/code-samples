import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OrderService } from '@tigerq-frontend/admin/core/services/order.service';
import {
  PaginationCommonQueryInterface,
  ProductInterface,
  ShippingAddressInterface,
} from '@tigerq-frontend/core/interfaces';
import { OrderPayingTypeEnum } from '@tigerq-frontend/core/enums';
import { UserListInterface } from '@tigerq-frontend/admin/core/interfaces/user/user-list.interface';
import { CreateOrderService } from '../../services/create-order.service';
import {
  CommonValidationErrorMessageInterface,
  isProductsItemsEqual,
  validationErrorMessages,
} from '@tigerq-frontend/helpers';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CreateOrderStepsEnum } from '@tigerq-frontend/admin/core/enums/create-order-steps.enum';
import { NotificationsTextConstants } from '@tigerq-frontend/core/constants';
import { CommonSnackbarComponent, CommonSnackbarService } from '@tigerq-frontend/shared';
import { CreateOrderByInvoiceInterface } from '@tigerq-frontend/admin/core/interfaces/order/create-order-by-invoice.interface';
import { MatSnackBarRef } from '@angular/material/snack-bar/snack-bar-ref';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'tq-create-order-page',
  templateUrl: './create-order-page.component.html',
  styleUrls: ['./create-order-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateOrderPageComponent implements OnInit {
  public isLinear: boolean = true;
  public firstStepChooseCustomerFormControl: FormControl = new FormControl(null, Validators.required);
  public secondStepChooseProducts: FormControl = new FormControl(null, Validators.required);
  public thirdStepCheckIsConfigFileRequired: FormControl = new FormControl(null, Validators.required);
  public fourthStepCheckShippingAddressIsRequired: FormControl = new FormControl(null, Validators.required);
  public fifthStepBillingInfoAndPay: FormControl = new FormControl(null, Validators.required);

  public isLoadedCustomers: boolean = false;
  public isLoadedProductsFromServer: boolean = false;
  public customers: UserListInterface[];
  public readonly validationErrorMessages: CommonValidationErrorMessageInterface = validationErrorMessages;
  public _configFileId: number | null;
  public isOneOfProductsHasInformationRequired: boolean = false;
  public isShippingAddressRequired: boolean = false;
  public _shippingAddressData: ShippingAddressInterface = null;
  public _isProductsPriceChanges: boolean = false;
  public isProductsFromServerLoaded: boolean = false;
  public _productsFromServer: ProductInterface[] = [];
  public _onChangesProductsPriceSnackbarRef: MatSnackBarRef<CommonSnackbarComponent>;
  public _onChangesOrderCreationPendingSnackbarRef: MatSnackBarRef<CommonSnackbarComponent>;
  public isInOrderCreatingProcess: boolean = false;

  constructor(
    public readonly _orderService: OrderService,
    public readonly _createOrderService: CreateOrderService,
    public readonly _commonSnackbarService: CommonSnackbarService,
    public readonly _router: Router,
  ) {}

  public ngOnInit(): void {
    this.getCustomers();
    this.getProductsInOrder();
    this.onFirstStepChooseCustomerFormControlWatching();
  }

  public get shippingAddressData(): ShippingAddressInterface | null {
    return this._shippingAddressData;
  }

  public get selectedCustomer(): UserListInterface {
    return this.firstStepChooseCustomerFormControl.value;
  }

  public getCustomers(): void {
    this.isLoadedCustomers = false;
    const query: PaginationCommonQueryInterface = {};
    this._orderService
      .getCustomers(query)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.customers = res.results;
        this.isLoadedCustomers = true;
      });
  }

  public getProductsInOrder(): void {
    this._createOrderService
      .getProductItemsInOrder()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        res.length
          ? this.secondStepChooseProducts.patchValue(res.length)
          : this.secondStepChooseProducts.patchValue(null);
      });
  }

  public onFirstStepChooseCustomerFormControlWatching(): void {
    this.firstStepChooseCustomerFormControl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this._createOrderService.clearProductsInOrder();
      this._shippingAddressData = null;
    });
  }

  public configFileIsUploaded(event: number | null): void {
    this.thirdStepCheckIsConfigFileRequired.patchValue(event);
    this._configFileId = event;
  }

  public onSelectionStepperChange(event: StepperSelectionEvent): void {
    switch (event.selectedIndex) {
      case CreateOrderStepsEnum.selectCustomer:
        return;
      case CreateOrderStepsEnum.selectProducts:
        this.removeNotification();
        return;
      case CreateOrderStepsEnum.addConfigFile:
        this.checkIsOneOfProductsHasInformationRequired();
        return;
      case CreateOrderStepsEnum.addShippingAddress:
        this.checkIsShippingAddressRequired();
        return;
    }
  }

  public checkIsOneOfProductsHasInformationRequired(): void {
    this.isLoadedProductsFromServer = false;
    this._createOrderService
      .onGetProductsByIds()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.isOneOfProductsHasInformationRequired = !!res.find(product => product.information_required);
        this.isOneOfProductsHasInformationRequired
          ? this.thirdStepCheckIsConfigFileRequired.patchValue(null)
          : this.thirdStepCheckIsConfigFileRequired.patchValue(true);
        this.isLoadedProductsFromServer = true;
      });
  }

  public checkIsShippingAddressRequired(): void {
    this.isLoadedProductsFromServer = false;
    this._createOrderService
      .onGetProductsByIds()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.isShippingAddressRequired = !!res.find(product => product.shipping_address_required);
        this.isShippingAddressRequired
          ? this.fourthStepCheckShippingAddressIsRequired.patchValue(null)
          : this.fourthStepCheckShippingAddressIsRequired.patchValue(true);
        this.isLoadedProductsFromServer = true;
      });
  }

  public saveShippingFormInfo(data: ShippingAddressInterface): void {
    this.fourthStepCheckShippingAddressIsRequired.patchValue(data);
    this._shippingAddressData = data;
    this._showSuccessSnackbar(NotificationsTextConstants.shippingAddressAddedToOrderSuccess);
  }

  public _showSuccessSnackbar(message: string): void {
    this._commonSnackbarService.showSuccess(message);
  }

  public _createDataForPayingByInvoice(): CreateOrderByInvoiceInterface {
    const order_products = this._createOrderService.getProducts().map(item => ({
      product_id: item.id,
      product_count: item.quantity,
      product_items: item.product_items,
    }));
    const shipping_address = this._shippingAddressData || null;
    return {
      owner: this.firstStepChooseCustomerFormControl.value.id,
      paying_type: OrderPayingTypeEnum.byInvoice,
      order_products,
      shipping_address,
      config: this._configFileId,
    };
  }

  public isBillingInfoSuccessfullyUpdated(event: boolean | null): void {
    this.fifthStepBillingInfoAndPay.patchValue(event);
  }

  public checkIsOrderPriceChanges(): void {
    this.isInOrderCreatingProcess = true;
    this.isProductsFromServerLoaded = false;
    this._createOrderService
      .onGetProductsByIds()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this._productsFromServer = res;
        this._isProductsPriceChanges = isProductsItemsEqual(res, this._createOrderService.getProducts());
        this.checkOrderCreation();
      });
  }

  public checkOrderCreation(): void {
    if (
      this.firstStepChooseCustomerFormControl.valid &&
      this.secondStepChooseProducts.valid &&
      this.thirdStepCheckIsConfigFileRequired.valid &&
      this.fourthStepCheckShippingAddressIsRequired.valid &&
      this.fifthStepBillingInfoAndPay.valid
    ) {
      if (this._isProductsPriceChanges) {
        this.updateProductsInOrder(this._productsFromServer);
        this._showOnChangesProductsPriceNotification();
      } else {
        this.createOrder();
      }
    }
  }

  public createOrder(): void {
    this._showOrderCreationPendingNotification();
    this._orderService
      .createOrder(this._createDataForPayingByInvoice())
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.isInOrderCreatingProcess = false;
          if (this._onChangesOrderCreationPendingSnackbarRef) {
            this._onChangesOrderCreationPendingSnackbarRef.dismiss();
          }
          this._router.navigate(['orders']);
          this._createOrderService.removeConfigFile();
          this._createOrderService.clearProductsInOrder();
          this._showSuccessSnackbar(NotificationsTextConstants.orderCreateSuccess);
        },
        error => {
          this.isInOrderCreatingProcess = false;
          if (this._onChangesOrderCreationPendingSnackbarRef) {
            this._onChangesOrderCreationPendingSnackbarRef.dismiss();
          }
          if (error.stripe) {
            error.stripe.invalid_request_error
              ? this._showErrorSnackbar(error.stripe.invalid_request_error)
              : this._showErrorSnackbar(error.stripe.card_error);
          } else if (error.non_field_errors) {
            this._showErrorSnackbar(error.non_field_errors.join());
          } else if (error.config) {
            this._showValidationConfigFileErrorsNotification(error.config.join());
          }
        },
      );
  }

  public updateProductsInOrder(productsFromServer: ProductInterface[]): void {
    this._createOrderService.updateOrdersProductItemsByProductsFromServer(productsFromServer);
  }

  public _showOnChangesProductsPriceNotification(): void {
    this._onChangesProductsPriceSnackbarRef = this._commonSnackbarService.showInfo(
      NotificationsTextConstants.productsPriceChangedInfo,
      {
        duration: 0,
      },
    );
  }

  public _showValidationConfigFileErrorsNotification(message: string): void {
    this._onChangesProductsPriceSnackbarRef = this._commonSnackbarService.showError(message, {
      duration: 0,
    });
  }

  public _showOrderCreationPendingNotification(): void {
    this._onChangesOrderCreationPendingSnackbarRef = this._commonSnackbarService.showSuccess(
      NotificationsTextConstants.orderCreationPending,
      {
        duration: 0,
      },
    );
  }

  public _showErrorSnackbar(message: string): void {
    this._commonSnackbarService.showError(message);
  }

  public removeNotification(): void {
    if (this._onChangesProductsPriceSnackbarRef) {
      this._onChangesProductsPriceSnackbarRef.dismiss();
    }
  }
}
