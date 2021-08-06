import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CreateOrderPageComponent } from './create-order-page.component';
import { OrdersPageComponent } from '../orders-page/orders-page.component';
import { OrdersListComponent } from '../../components/orders-list/orders-list.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderDetailProductsListComponent } from '../../components/order-detail-products-list/order-detail-products-list.component';
import { InvestigatorAutocompleteInputComponent } from '../../components/investigator-autocomplete-input/investigator-autocomplete-input.component';
import { ReceivedStatusComponent } from '../../components/received-status/received-status.component';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ConfigFileComponent } from '../../components/config-file/config-file.component';
import { AddShippingAddressComponent } from '../../components/add-shipping-address/add-shipping-address.component';
import { BillingInfoComponent } from '../../components/billing-info/billing-info.component';
import { CustomerAutocompleteInputComponent } from '../../components/customer-autocomplete-input/customer-autocomplete-input.component';
import { AddProductsComponent } from '../../components/add-products/add-products.component';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from '../../orders-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  BackdropLoaderModule,
  BillingFormModule,
  CommonSnackbarModule,
  CommonSnackbarService,
  CommonSnackbarServiceMock,
  ConfirmDialogModule,
  CountryAutocompleteInputModule,
  CurrencySymbolModule,
  FilenameFromPathModule,
  LocalDateModule,
  NonFieldErrorsBlockModule,
  OrderPayingStatusTextModule,
  OrderProductFilesDownloadDialogModule,
  OrderProductStatusTextModule,
  OrderPurchaseStatusTextModule,
  OrderStatusTextModule,
  ProductItemModule,
  ProfileFullNameModule,
  ServerErrorFormValidatorModule,
  ShippingFormModule,
  UserFilesUploadWrapModule,
} from '@tigerq-frontend/shared';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSearchPanelModule } from '@tigerq-frontend/admin/shared/components/user-search-panel/user-search-panel.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMock } from '@tigerq-frontend/core/mocks';
import { OrderService } from '@tigerq-frontend/admin/core/services/order.service';
import { OrderServiceMock } from '@tigerq-frontend/admin/core/testing/order-service.mock';
import { AdminPanelService } from '@tigerq-frontend/admin/core/services/admin-panel.service';
import { AdminPanelServiceMock } from '@tigerq-frontend/admin/core/testing/admin-panel.service.mock';
import { ProfileService } from '@tigerq-frontend/admin/core/services/profile.service';
import { ProfileServiceMock } from '@tigerq-frontend/admin/core/testing/profile.service.mock';
import { UserPanelService } from '@tigerq-frontend/admin/core/services/user-panel.service';
import { UserPanelServiceMock } from '@tigerq-frontend/admin/core/testing/user-panel.service.mock';
import { ProductsService } from '@tigerq-frontend/admin/core/services/products.service';
import { ProductsServiceMock } from '@tigerq-frontend/admin/core/testing/products.service.mock';
import { HttpClient } from '@angular/common/http';
import { CreateOrderService } from '../../services/create-order.service';
import { CreateOrderServiceMock } from '../../services/testing/create-order-service.mock';
import { asyncData, asyncError, validationErrorMessages } from '@tigerq-frontend/helpers';
import { ApiPaginationResponseInterface, OrderInterface } from '@tigerq-frontend/core/interfaces';
import { UserListInterface } from '@tigerq-frontend/admin/core/interfaces/user/user-list.interface';
import { CurrentUserGroupEnum, UserStatusesEnum } from '@tigerq-frontend/core/enums';
import { productMock } from '@tigerq-frontend/core/mocks';
import { CreateOrderStepsEnum } from '@tigerq-frontend/admin/core/enums/create-order-steps.enum';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { shippingAddressMock } from '@tigerq-frontend/core/mocks';
import * as helpers from '@tigerq-frontend/helpers';

export const paginationUserListMock: ApiPaginationResponseInterface<UserListInterface> = {
  count: 10,
  previous: '',
  next: '',
  results: [
    {
      id: 1,
      first_name: 'test',
      last_name: 'test',
      status: UserStatusesEnum.active,
      account_type: CurrentUserGroupEnum.customer,
      department: 'test',
      institution: 'test',
      email: 'testemail@gmail.com',
    },
  ],
};
/* eslint-disable @typescript-eslint/unbound-method */
describe('CreateOrderPageComponent', () => {
  let component: CreateOrderPageComponent;
  let fixture: ComponentFixture<CreateOrderPageComponent>;

  /* eslint-disable  @typescript-eslint/await-thenable */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrdersPageComponent,
        OrdersListComponent,
        CreateOrderPageComponent,
        OrderDetailComponent,
        OrderDetailProductsListComponent,
        InvestigatorAutocompleteInputComponent,
        ReceivedStatusComponent,
        ProductsListComponent,
        ConfigFileComponent,
        AddShippingAddressComponent,
        BillingInfoComponent,
        CustomerAutocompleteInputComponent,
        AddProductsComponent,
      ],
      imports: [
        CommonModule,
        OrdersRoutingModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatPaginatorModule,
        MatMenuModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatCheckboxModule,
        BackdropLoaderModule,
        CommonSnackbarModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        UserSearchPanelModule,
        OrderPurchaseStatusTextModule,
        OrderStatusTextModule,
        OrderPayingStatusTextModule,
        ProfileFullNameModule,
        OrderProductStatusTextModule,
        CountryAutocompleteInputModule,
        UserFilesUploadWrapModule,
        FilenameFromPathModule,
        LocalDateModule,
        MatBadgeModule,
        MatIconModule,
        CurrencySymbolModule,
        ShippingFormModule,
        BillingFormModule,
        NonFieldErrorsBlockModule,
        ServerErrorFormValidatorModule,
        MatStepperModule,
        MatTabsModule,
        ProductItemModule,
        InfiniteScrollModule,
        OrderProductFilesDownloadDialogModule,
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: OrderService,
          useClass: OrderServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: AdminPanelService,
          useClass: AdminPanelServiceMock,
        },
        {
          provide: ProfileService,
          useClass: ProfileServiceMock,
        },
        {
          provide: UserPanelService,
          useClass: UserPanelServiceMock,
        },
        {
          provide: ProductsService,
          useClass: ProductsServiceMock,
        },
        {
          provide: HttpClient,
          useValue: {},
        },
        {
          provide: CreateOrderService,
          useClass: CreateOrderServiceMock,
        },
        {
          provide: CommonSnackbarService,
          useClass: CommonSnackbarServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should isLinear to be true initially', () => {
    expect(component.isLinear).toBe(true);
  });

  it('should firstStepChooseCustomerFormControl to be object initially', () => {
    expect(component.firstStepChooseCustomerFormControl).toMatchObject({});
  });

  it('should secondStepChooseProducts to be object initially', () => {
    expect(component.secondStepChooseProducts).toMatchObject({});
  });

  it('should thirdStepCheckIsConfigFileRequired to be object initially', () => {
    expect(component.thirdStepCheckIsConfigFileRequired).toMatchObject({});
  });

  it('should fourthStepCheckShippingAddressIsRequired to be object initially', () => {
    expect(component.fourthStepCheckShippingAddressIsRequired).toMatchObject({});
  });

  it('should fifthStepBillingInfoAndPay to be object initially', () => {
    expect(component.fifthStepBillingInfoAndPay).toMatchObject({});
  });

  it('should isLoadedCustomers to be false initially', () => {
    expect(component.isLoadedCustomers).toBe(false);
  });

  it('should isLoadedProductsFromServer to be false initially', () => {
    expect(component.isLoadedProductsFromServer).toBe(false);
  });

  it('should customers to be undefined initially', () => {
    expect(component.customers).toBeUndefined();
  });

  it('should validationErrorMessages to be validationErrorMessages initially', () => {
    expect(component.validationErrorMessages).toBe(validationErrorMessages);
  });

  it('should _configFileId to be undefined initially', () => {
    expect(component.customers).toBeUndefined();
  });

  it('should isOneOfProductsHasInformationRequired to be false initially', () => {
    expect(component.isOneOfProductsHasInformationRequired).toBe(false);
  });

  it('should isShippingAddressRequired to be false initially', () => {
    expect(component.isShippingAddressRequired).toBe(false);
  });

  it('should _shippingAddressData to be null initially', () => {
    expect(component._shippingAddressData).toBe(null);
  });

  it('should _isProductsPriceChanges to be false initially', () => {
    expect(component._isProductsPriceChanges).toBe(false);
  });

  it('should isProductsFromServerLoaded to be false initially', () => {
    expect(component.isProductsFromServerLoaded).toBe(false);
  });

  it('should _onChangesProductsPriceSnackbarRef to be undefined initially', () => {
    expect(component._onChangesProductsPriceSnackbarRef).toBeUndefined();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'getCustomers').mockImplementation(() => null);
      jest.spyOn(component, 'getProductsInOrder').mockImplementation(() => null);
      jest.spyOn(component, 'onFirstStepChooseCustomerFormControlWatching').mockImplementation(() => null);
    });

    it('should call getCustomers()', () => {
      expect(component.getCustomers).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component.getCustomers).toHaveBeenCalled();
    });

    it('should call getProductsInOrder()', () => {
      expect(component.getProductsInOrder).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component.getProductsInOrder).toHaveBeenCalled();
    });

    it('should call onFirstStepChooseCustomerFormControlWatching()', () => {
      expect(component.onFirstStepChooseCustomerFormControlWatching).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component.onFirstStepChooseCustomerFormControlWatching).toHaveBeenCalled();
    });
  });

  describe('getCustomers()', () => {
    const getCustomersSpy = () => jest.spyOn(component._orderService, 'getCustomers');

    it('should define customers variable', fakeAsync(() => {
      getCustomersSpy().mockReturnValue(asyncData(paginationUserListMock));
      expect(component.customers).toBeUndefined();
      component.getCustomers();
      tick();
      expect(component.customers).toBeDefined();
    }));

    it('should isLoadedCustomers variable equal true when _orderService.getCustomers() return data', fakeAsync(() => {
      getCustomersSpy().mockReturnValue(asyncData(paginationUserListMock));
      expect(component.isLoadedCustomers).toBe(false);
      component.getCustomers();
      tick();
      expect(component.isLoadedCustomers).toBe(true);
    }));
  });

  describe('getProductsInOrder()', () => {
    const getProductItemsInOrderSpy = () => jest.spyOn(component._createOrderService, 'getProductItemsInOrder');

    beforeEach(() => {
      component.secondStepChooseProducts = new FormControl(null, Validators.required);
    });

    it('should secondStepChooseProducts be equal _createOrderService.getProductItemsInOrder()', fakeAsync(() => {
      const products = [productMock];
      getProductItemsInOrderSpy().mockReturnValue(asyncData(products));
      expect(component.secondStepChooseProducts.value).toBe(null);
      component.getProductsInOrder();
      tick();
      expect(component.secondStepChooseProducts.value).toBe(products.length);
    }));

    it('should secondStepChooseProducts be equal null if _createOrderService.getProductItemsInOrder() return empty array', fakeAsync(() => {
      getProductItemsInOrderSpy().mockReturnValue(asyncData([]));
      expect(component.secondStepChooseProducts.value).toBe(null);
      component.getProductsInOrder();
      tick();
      expect(component.secondStepChooseProducts.value).toBe(null);
    }));
  });

  describe('configFileIsUploaded()', () => {
    it('should call thirdStepCheckIsConfigFileRequired.patchValue', () => {
      component.thirdStepCheckIsConfigFileRequired = new FormControl(null, Validators.required);
      component.thirdStepCheckIsConfigFileRequired.patchValue(1);
      component.configFileIsUploaded(1);
      expect(component.thirdStepCheckIsConfigFileRequired.value).toBe(1);
    });

    it('should define _configFileId variable', () => {
      component.thirdStepCheckIsConfigFileRequired = new FormControl(null, Validators.required);
      expect(component._configFileId).toBeUndefined();
      component.configFileIsUploaded(1);
      expect(component._configFileId).toBeDefined();
    });

    it('should be _configFileId variable equal configFileIsUploaded() parameter', () => {
      const parameter: number = 1;
      component.thirdStepCheckIsConfigFileRequired = new FormControl(null, Validators.required);
      expect(component._configFileId).not.toEqual(parameter);
      component.configFileIsUploaded(parameter);
      expect(component._configFileId).toEqual(parameter);
    });
  });

  describe('onSelectionStepperChange()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'removeNotification').mockImplementation(() => null);
      jest.spyOn(component, 'checkIsOneOfProductsHasInformationRequired').mockImplementation(() => null);
      jest.spyOn(component, 'checkIsShippingAddressRequired').mockImplementation(() => null);
    });

    it('should call removeNotification() if onSelectionStepperChange() event parameter equal CreateOrderStepsEnum.selectProducts', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: CreateOrderStepsEnum.selectProducts,
        previouslySelectedIndex: CreateOrderStepsEnum.selectCustomer,
        selectedStep: null,
        previouslySelectedStep: null,
      };
      expect(component.removeNotification).not.toHaveBeenCalled();
      component.onSelectionStepperChange(event);
      expect(component.removeNotification).toHaveBeenCalled();
    });

    it('should NOT call removeNotification() if onSelectionStepperChange() event parameter not equal CreateOrderStepsEnum.selectProducts', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: CreateOrderStepsEnum.selectCustomer,
        previouslySelectedIndex: CreateOrderStepsEnum.selectCustomer,
        selectedStep: null,
        previouslySelectedStep: null,
      };
      component.onSelectionStepperChange(event);
      expect(component.removeNotification).not.toHaveBeenCalled();
    });

    it('should call checkIsOneOfProductsHasInformationRequired() if onSelectionStepperChange() event parameter equal CreateOrderStepsEnum.addConfigFile', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: CreateOrderStepsEnum.addConfigFile,
        previouslySelectedIndex: CreateOrderStepsEnum.selectProducts,
        selectedStep: null,
        previouslySelectedStep: null,
      };
      expect(component.checkIsOneOfProductsHasInformationRequired).not.toHaveBeenCalled();
      component.onSelectionStepperChange(event);
      expect(component.checkIsOneOfProductsHasInformationRequired).toHaveBeenCalled();
    });

    it('should NOT call checkIsOneOfProductsHasInformationRequired() if onSelectionStepperChange() event parameter not equal CreateOrderStepsEnum.addConfigFile', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: CreateOrderStepsEnum.selectProducts,
        previouslySelectedIndex: CreateOrderStepsEnum.addConfigFile,
        selectedStep: null,
        previouslySelectedStep: null,
      };
      component.onSelectionStepperChange(event);
      expect(component.checkIsOneOfProductsHasInformationRequired).not.toHaveBeenCalled();
    });

    it('should call checkIsShippingAddressRequired() if onSelectionStepperChange() event parameter equal CreateOrderStepsEnum.addShippingAddress', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: CreateOrderStepsEnum.addShippingAddress,
        previouslySelectedIndex: null,
        selectedStep: null,
        previouslySelectedStep: null,
      };
      expect(component.checkIsShippingAddressRequired).not.toHaveBeenCalled();
      component.onSelectionStepperChange(event);
      expect(component.checkIsShippingAddressRequired).toHaveBeenCalled();
    });

    it('should NOT call checkIsShippingAddressRequired() if onSelectionStepperChange() event parameter not equal CreateOrderStepsEnum.addShippingAddress', () => {
      const event: StepperSelectionEvent = {
        selectedIndex: CreateOrderStepsEnum.addConfigFile,
        previouslySelectedIndex: CreateOrderStepsEnum.selectProducts,
        selectedStep: null,
        previouslySelectedStep: null,
      };
      component.onSelectionStepperChange(event);
      expect(component.checkIsShippingAddressRequired).not.toHaveBeenCalled();
    });
  });

  describe('checkIsOneOfProductsHasInformationRequired()', () => {
    const onGetProductsByIdsSpy = () => jest.spyOn(component._createOrderService, 'onGetProductsByIds');
    const products = [productMock];

    it('should isOneOfProductsHasInformationRequired variable equal true when _createOrderService.onGetProductsByIds() return products with information_required', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData(products));
      expect(component.isOneOfProductsHasInformationRequired).toEqual(false);
      component.checkIsOneOfProductsHasInformationRequired();
      tick();
      expect(component.isOneOfProductsHasInformationRequired).toEqual(true);
    }));

    it('it should isOneOfProductsHasInformationRequired variable equal false when _createOrderService.onGetProductsByIds() return products without information_required', fakeAsync(() => {
      const products = { ...productMock, information_required: false };
      onGetProductsByIdsSpy().mockReturnValue(asyncData([products]));
      expect(component.isOneOfProductsHasInformationRequired).toEqual(false);
      component.checkIsOneOfProductsHasInformationRequired();
      tick();
      expect(component.isOneOfProductsHasInformationRequired).toEqual(false);
    }));

    it('it should thirdStepCheckIsConfigFileRequired value equal null when _createOrderService.onGetProductsByIds() return products with information_required', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData(products));
      component.checkIsOneOfProductsHasInformationRequired();
      tick();
      expect(component.thirdStepCheckIsConfigFileRequired.value).toEqual(null);
    }));

    it('it should thirdStepCheckIsConfigFileRequired value equal true when _createOrderService.onGetProductsByIds() return products without information_required', fakeAsync(() => {
      const products = { ...productMock, information_required: false };
      onGetProductsByIdsSpy().mockReturnValue(asyncData([products]));
      component.checkIsOneOfProductsHasInformationRequired();
      tick();
      expect(component.thirdStepCheckIsConfigFileRequired.value).toEqual(true);
    }));
  });

  describe('checkIsShippingAddressRequired()', () => {
    const onGetProductsByIdsSpy = () => jest.spyOn(component._createOrderService, 'onGetProductsByIds');
    const products = [productMock];

    it('it should isShippingAddressRequired variable equal true when _createOrderService.onGetProductsByIds() return products with shipping_address_required', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData(products));
      expect(component.isShippingAddressRequired).toEqual(false);
      component.checkIsShippingAddressRequired();
      tick();
      expect(component.isShippingAddressRequired).toEqual(true);
    }));

    it('it should isShippingAddressRequired variable equal false when _createOrderService.onGetProductsByIds() return products without shipping_address_required', fakeAsync(() => {
      const products = { ...productMock, shipping_address_required: false };
      onGetProductsByIdsSpy().mockReturnValue(asyncData([products]));
      expect(component.isShippingAddressRequired).toEqual(false);
      component.checkIsShippingAddressRequired();
      tick();
      expect(component.isShippingAddressRequired).toEqual(false);
    }));

    it('it should fourthStepCheckShippingAddressIsRequired variable equal null when _createOrderService.onGetProductsByIds() return products with shipping_address_required', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData(products));
      component.checkIsShippingAddressRequired();
      tick();
      expect(component.fourthStepCheckShippingAddressIsRequired.value).toEqual(null);
    }));

    it('it should fourthStepCheckShippingAddressIsRequired variable equal true when _createOrderService.onGetProductsByIds() return products without shipping_address_required', fakeAsync(() => {
      const products = { ...productMock, shipping_address_required: false };
      onGetProductsByIdsSpy().mockReturnValue(asyncData([products]));
      component.checkIsShippingAddressRequired();
      tick();
      expect(component.fourthStepCheckShippingAddressIsRequired.value).toEqual(true);
    }));
  });

  describe('saveShippingFormInfo()', () => {
    beforeEach(() => {
      jest.spyOn(component, '_showSuccessSnackbar').mockImplementation(() => null);
    });

    it('it should fourthStepCheckShippingAddressIsRequired.value equal saveShippingFormInfo() parameter', () => {
      expect(component.fourthStepCheckShippingAddressIsRequired.value).not.toEqual(shippingAddressMock);
      component.saveShippingFormInfo(shippingAddressMock);
      expect(component.fourthStepCheckShippingAddressIsRequired.value).toEqual(shippingAddressMock);
    });

    it('it should _shippingAddressData variable equal saveShippingFormInfo() parameter', () => {
      expect(component._shippingAddressData).not.toEqual(shippingAddressMock);
      component.saveShippingFormInfo(shippingAddressMock);
      expect(component._shippingAddressData).toEqual(shippingAddressMock);
    });

    it('it should call _showSuccessSnackbar()', () => {
      expect(component._showSuccessSnackbar).not.toHaveBeenCalled();
      component.saveShippingFormInfo(shippingAddressMock);
      expect(component._showSuccessSnackbar).toHaveBeenCalled();
    });
  });

  describe('isBillingInfoSuccessfullyUpdated()', () => {
    it('it should fifthStepBillingInfoAndPay.value equal isBillingInfoSuccessfullyUpdated() parameter', () => {
      expect(component.fifthStepBillingInfoAndPay.value).not.toEqual(true);
      component.isBillingInfoSuccessfullyUpdated(true);
      expect(component.fifthStepBillingInfoAndPay.value).toEqual(true);
    });
  });

  describe('checkIsOrderPriceChanges()', () => {
    const onGetProductsByIdsSpy = () => jest.spyOn(component._createOrderService, 'onGetProductsByIds');

    beforeEach(() => {
      jest.spyOn(helpers, 'isProductsItemsEqual').mockImplementation(() => null);
      jest.spyOn(component, 'checkOrderCreation').mockImplementation(() => null);
      jest.spyOn(component._createOrderService, 'getProducts').mockImplementation(() => null);
    });

    it('should _productsFromServer variable be equal returned data from onGetProductsByIds()', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData([productMock]));
      expect(component._productsFromServer).not.toEqual([productMock]);
      component.checkIsOrderPriceChanges();
      tick();
      expect(component._productsFromServer).toEqual([productMock]);
    }));

    it('should _isProductsPriceChanges variable be equal returned data from isProductsItemsEqual()', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData([productMock]));
      const result = helpers.isProductsItemsEqual([productMock], [productMock]);
      expect(component._isProductsPriceChanges).not.toEqual(result);
      component.checkIsOrderPriceChanges();
      tick();
      expect(component._isProductsPriceChanges).toEqual(result);
    }));

    it('should call checkOrderCreation()', fakeAsync(() => {
      onGetProductsByIdsSpy().mockReturnValue(asyncData([productMock]));
      expect(component.checkOrderCreation).not.toHaveBeenCalled();
      component.checkIsOrderPriceChanges();
      tick();
      expect(component.checkOrderCreation).toHaveBeenCalled();
    }));
  });

  describe('checkOrderCreation()', () => {
    const firstStepChooseCustomerFormControlSpy = () =>
      jest.spyOn(component.firstStepChooseCustomerFormControl, 'valid', 'get');
    const secondStepChooseProductsSpy = () => jest.spyOn(component.secondStepChooseProducts, 'valid', 'get');
    const thirdStepCheckIsConfigFileRequiredSpy = () =>
      jest.spyOn(component.thirdStepCheckIsConfigFileRequired, 'valid', 'get');
    const fourthStepCheckShippingAddressIsRequiredSpy = () =>
      jest.spyOn(component.fourthStepCheckShippingAddressIsRequired, 'valid', 'get');
    const fifthStepBillingInfoAndPaySpy = () => jest.spyOn(component.fifthStepBillingInfoAndPay, 'valid', 'get');

    beforeEach(() => {
      jest.spyOn(component, 'updateProductsInOrder').mockImplementation(() => null);
      jest.spyOn(component, '_showOnChangesProductsPriceNotification').mockImplementation(() => null);
      jest.spyOn(component, 'createOrder').mockImplementation(() => null);
    });

    it('it should call updateProductsInOrder() when all steps valid and _isProductsPriceChanges equal true', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(true);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = true;

      expect(component.updateProductsInOrder).not.toHaveBeenCalled();
      component.checkOrderCreation();
      expect(component.updateProductsInOrder).toHaveBeenCalled();
    });

    it('it should call _showOnChangesProductsPriceNotification() when all steps valid and _isProductsPriceChanges equal true', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(true);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = true;

      expect(component._showOnChangesProductsPriceNotification).not.toHaveBeenCalled();
      component.checkOrderCreation();
      expect(component._showOnChangesProductsPriceNotification).toHaveBeenCalled();
    });

    it('it should NOT call updateProductsInOrder() when all steps valid and _isProductsPriceChanges equal false', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(true);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = false;

      component.checkOrderCreation();
      expect(component.updateProductsInOrder).not.toHaveBeenCalled();
    });

    it('it should NOT call _showOnChangesProductsPriceNotification() when all steps valid and _isProductsPriceChanges equal false', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(true);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = false;

      component.checkOrderCreation();
      expect(component._showOnChangesProductsPriceNotification).not.toHaveBeenCalled();
    });

    it('it should NOT call updateProductsInOrder() when one of the steps invalid and _isProductsPriceChanges equal true', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(false);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = true;

      component.checkOrderCreation();
      expect(component.updateProductsInOrder).not.toHaveBeenCalled();
    });

    it('it should NOT call _showOnChangesProductsPriceNotification() when one of the steps invalid and _isProductsPriceChanges equal true', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(false);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = true;

      component.checkOrderCreation();
      expect(component._showOnChangesProductsPriceNotification).not.toHaveBeenCalled();
    });

    it('it should NOT call updateProductsInOrder() when one of the steps invalid and _isProductsPriceChanges equal false', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(false);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = false;

      component.checkOrderCreation();
      expect(component.updateProductsInOrder).not.toHaveBeenCalled();
    });

    it('it should NOT call _showOnChangesProductsPriceNotification() when one of the steps invalid and _isProductsPriceChanges equal false', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(false);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = false;

      component.checkOrderCreation();
      expect(component._showOnChangesProductsPriceNotification).not.toHaveBeenCalled();
    });

    it('it should call createOrder() when all steps valid and _isProductsPriceChanges equal false', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(true);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = false;

      expect(component.createOrder).not.toHaveBeenCalled();
      component.checkOrderCreation();
      expect(component.createOrder).toHaveBeenCalled();
    });

    it('it should NOT call createOrder() when one of the steps invalid and _isProductsPriceChanges equal true', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(false);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = true;

      component.checkOrderCreation();
      expect(component.createOrder).not.toHaveBeenCalled();
    });

    it('it should NOT call createOrder() when all steps valid and _isProductsPriceChanges equal true', () => {
      firstStepChooseCustomerFormControlSpy().mockReturnValue(true);
      secondStepChooseProductsSpy().mockReturnValue(true);
      thirdStepCheckIsConfigFileRequiredSpy().mockReturnValue(true);
      fourthStepCheckShippingAddressIsRequiredSpy().mockReturnValue(true);
      fifthStepBillingInfoAndPaySpy().mockReturnValue(true);
      component._isProductsPriceChanges = true;

      component.checkOrderCreation();
      expect(component.createOrder).not.toHaveBeenCalled();
    });
  });

  describe('createOrder()', () => {
    const createOrderSpy = () => jest.spyOn(component._orderService, 'createOrder');
    const getRouterNavigateSpy = () => jest.spyOn(component._router, 'navigate');
    const orderMock: OrderInterface = {
      id: 1,
      paying_type: 0,
      date: '',
      status: 0,
      sum: '',
      order_products: [productMock],
      shipping_address: shippingAddressMock,
      config: 1,
    };

    beforeEach(() => {
      jest.spyOn(component._createOrderService, 'removeConfigFile').mockImplementation(() => null);
      jest.spyOn(component._createOrderService, 'clearProductsInOrder').mockImplementation(() => null);
      jest.spyOn(component, '_createDataForPayingByInvoice').mockImplementation(() => null);
      jest.spyOn(component._createOrderService, 'getProducts').mockImplementation(() => null);
      jest.spyOn(component, '_showSuccessSnackbar').mockImplementation(() => null);
      jest.spyOn(component, '_showErrorSnackbar').mockImplementation(() => null);
      jest.spyOn(component._router, 'navigate');
      jest.spyOn(component, '_showOnChangesProductsPriceNotification').mockImplementation(() => null);
    });

    it('it should call _router.navigate() when _orderService.createOrder() return success', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncData(orderMock));
      component.createOrder();
      tick();
      expect(getRouterNavigateSpy()).toHaveBeenCalled();
    }));

    it('it should NOT call _router.navigate() when _orderService.createOrder() return error', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncError({}));
      component.createOrder();
      tick();
      expect(getRouterNavigateSpy()).not.toHaveBeenCalled();
    }));

    it('should call _createOrderService.removeConfigFile() when _orderService.createOrder return success', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncData(orderMock));
      expect(component._createOrderService.removeConfigFile).not.toHaveBeenCalled();
      component.createOrder();
      tick();
      expect(component._createOrderService.removeConfigFile).toHaveBeenCalled();
    }));

    it('should NOT call _createOrderService.removeConfigFile() when _orderService.createOrder return error', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncError({}));
      component.createOrder();
      tick();
      expect(component._createOrderService.removeConfigFile).not.toHaveBeenCalled();
    }));

    it('should call _createOrderService.clearProductsInOrder() when _orderService.createOrder return success', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncData(orderMock));
      expect(component._createOrderService.clearProductsInOrder).not.toHaveBeenCalled();
      component.createOrder();
      tick();
      expect(component._createOrderService.clearProductsInOrder).toHaveBeenCalled();
    }));

    it('should NOT call _createOrderService.clearProductsInOrder() when _orderService.createOrder return error', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncError({}));
      component.createOrder();
      tick();
      expect(component._createOrderService.clearProductsInOrder).not.toHaveBeenCalled();
    }));

    it('should call _showSuccessSnackbar() when _orderService.createOrder return success', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncData(orderMock));
      expect(component._showSuccessSnackbar).not.toHaveBeenCalled();
      component.createOrder();
      tick();
      expect(component._showSuccessSnackbar).toHaveBeenCalled();
    }));

    it('should NOT call _showSuccessSnackbar() when _orderService.createOrder return error', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncError({}));
      component.createOrder();
      tick();
      expect(component._showSuccessSnackbar).not.toHaveBeenCalled();
    }));

    it('should NOT call _showErrorSnackbar() when _orderService.createOrder return success', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncData(orderMock));
      component.createOrder();
      tick();
      expect(component._showErrorSnackbar).not.toHaveBeenCalled();
    }));

    it('should call _showErrorSnackbar() when _orderService.createOrder return stripe error', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncError({ stripe: {} }));
      expect(component._showErrorSnackbar).not.toHaveBeenCalled();
      component.createOrder();
      tick();
      expect(component._showErrorSnackbar).toHaveBeenCalled();
    }));

    it('should call _showErrorSnackbar() when _orderService.createOrder return non_field_errors error', fakeAsync(() => {
      createOrderSpy().mockReturnValue(asyncError({ non_field_errors: ['error'] }));
      expect(component._showErrorSnackbar).not.toHaveBeenCalled();
      component.createOrder();
      tick();
      expect(component._showErrorSnackbar).toHaveBeenCalled();
    }));
  });
});
