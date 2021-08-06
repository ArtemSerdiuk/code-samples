import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  BackdropLoaderModule,
  CommonSnackbarModule,
  CommonSnackbarService,
  CommonSnackbarServiceMock,
  ConfigFileValidationErrorDialogModule,
  FilenameFromPathModule,
  UserFilesUploadWrapModule,
} from '@tigerq-frontend/shared';
import { ConfigFileUploadComponent } from './config-file-upload.component';
import { CartService } from '@tigerq-frontend/core/services';
import { CartServiceMock } from '@tigerq-frontend/portal/core/testing/cart.service.mock';
import { OrderService } from '@tigerq-frontend/portal/core/services/order.service';
import { OrderServiceMock } from '@tigerq-frontend/portal/core/testing/order.service.mock';
import { asyncData } from '@tigerq-frontend/helpers';
import { mockProducts } from '../../containers/my-cart-page/my-cart-page.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { productMock } from '@tigerq-frontend/core/mocks';
import { MatDialog } from '@angular/material/dialog';

/* eslint-disable @typescript-eslint/unbound-method */
const mockFile: Blob = new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });

describe('ConfigFileUploadComponent', () => {
  let component: ConfigFileUploadComponent;
  let fixture: ComponentFixture<ConfigFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BackdropLoaderModule,
        CommonSnackbarModule,
        UserFilesUploadWrapModule,
        FilenameFromPathModule,
        ConfigFileValidationErrorDialogModule,
      ],
      declarations: [ConfigFileUploadComponent],
      providers: [
        {
          provide: CartService,
          useClass: CartServiceMock,
        },
        {
          provide: OrderService,
          useClass: OrderServiceMock,
        },
        {
          provide: CommonSnackbarService,
          useClass: CommonSnackbarServiceMock,
        },
        {
          provide: MatDialog,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFileUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should productsInCart to be empty array initially', () => {
    expect(component.productsInCart).toMatchObject([]);
  });

  it('should isConfigFilesUploadProcess to be false initially', () => {
    expect(component.isConfigFilesUploadProcess).toBe(false);
  });

  it('should uploadedConfigFile to be undefined initially', () => {
    expect(component.uploadedConfigFile).toBeUndefined();
  });

  it('should uploadUserFilesErrors to be undefined initially', () => {
    expect(component.uploadUserFilesErrors).toBeUndefined();
  });

  it('should accept to be string initially', () => {
    expect(component.accept).toBe('.xlsx, .xls, .csv');
  });

  it('should configFileDownload to be undefined initially', () => {
    expect(component.configFileDownload).toBeUndefined();
  });

  it('should isConfigFileLoaded to be false initially', () => {
    expect(component.isConfigFileLoaded).toBe(false);
  });

  it('should configFile to be undefined initially', () => {
    expect(component.configFile).toBeUndefined();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(component, '_getItemsInCart').mockImplementation(() => null);
    });

    it('should call _getItemsInCart()', () => {
      expect(component._getItemsInCart).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component._getItemsInCart).toHaveBeenCalled();
    });
  });

  describe('_getItemsInCart()', () => {
    const getItemsInCartService = () => jest.spyOn(component._cartService, 'getItemsInCart');

    beforeEach(() => {
      jest.spyOn(component, 'generateConfigFileForOrder').mockImplementation(() => null);
    });

    it('should be equal productsInCart variable with return array', fakeAsync(() => {
      getItemsInCartService().mockReturnValue(asyncData(mockProducts));
      expect(component.productsInCart).not.toEqual(mockProducts);
      component._getItemsInCart();
      tick();
      expect(component.productsInCart).toEqual(mockProducts);
    }));

    it('should call generateConfigFileForOrder', fakeAsync(() => {
      getItemsInCartService().mockReturnValue(asyncData(mockProducts));
      expect(component.generateConfigFileForOrder).not.toHaveBeenCalled();
      component._getItemsInCart();
      tick();
      expect(component.generateConfigFileForOrder).toHaveBeenCalled();
    }));
  });

  describe('generateConfigFileForOrder()', () => {
    const getOrderServiceGenerateConfigTemplateFileForOrder = () =>
      jest.spyOn(component._orderService, 'generateConfigTemplateFileForOrder');

    beforeEach(() => {
      component.productsInCart = [productMock];
      component.products = [
        {
          product_id: 1,
          product_count: 10,
          product_items: [{ product_id: 'random1234' }],
        },
      ];
      jest.spyOn(component, '_showErrorSnackbar').mockImplementation(() => null);
    });

    it('should be defined configFile when _orderService.generateConfigTemplateFileForOrder success return value', fakeAsync(() => {
      getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncData(mockFile));
      expect(component.configFile).toBeUndefined();
      component.generateConfigFileForOrder();
      tick();
      expect(component.configFile).toBeDefined();
    }));

    // TODO: update test
    // it('should be undefined configFile when _orderService.generateConfigTemplateFileForOrder return error', fakeAsync(() => {
    //   getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncError({ order_products: {} }));
    //   expect(component.configFile).toBeUndefined();
    //   component.generateConfigFileForOrder();
    //   tick();
    //   expect(component.configFile).toBeUndefined();
    // }));

    it('should be equal configFile variable with return value', fakeAsync(() => {
      getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncData(mockFile));
      expect(component.configFile).toBeUndefined();
      component.generateConfigFileForOrder();
      tick();
      expect(component.configFile).toEqual(mockFile);
    }));

    it('should be defined configFileDownload when _orderService.generateConfigTemplateFileForOrder success return value', fakeAsync(() => {
      getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncData(mockFile));
      expect(component.configFileDownload).toBeUndefined();
      component.generateConfigFileForOrder();
      tick();
      expect(component.configFileDownload).toBeDefined();
    }));

    // TODO: update test
    // it('should be undefined configFileDownload when _orderService.generateConfigTemplateFileForOrder return error', fakeAsync(() => {
    //   getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncError({ message: {} }));
    //   expect(component.configFileDownload).toBeUndefined();
    //   component.generateConfigFileForOrder();
    //   tick();
    //   expect(component.configFileDownload).toBeUndefined();
    // }));

    it('should be equal configFileDownload when _orderService.generateConfigTemplateFileForOrder success return value', fakeAsync(() => {
      getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncData(mockFile));
      expect(component.configFileDownload).toBeUndefined();
      component.generateConfigFileForOrder();
      tick();
      expect(component.configFileDownload).toEqual('config.xlsx');
    }));

    it('should be true isConfigFileLoaded when _orderService.generateConfigTemplateFileForOrder success return value', fakeAsync(() => {
      getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncData(mockFile));
      expect(component.isConfigFileLoaded).toBe(false);
      component.generateConfigFileForOrder();
      tick();
      expect(component.isConfigFileLoaded).toBe(true);
    }));

    // TODO: update test
    // it('should be false configFileDownload when _orderService.generateConfigTemplateFileForOrder return error', fakeAsync(() => {
    //   getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncError({ message: {} }));
    //   expect(component.isConfigFileLoaded).toBe(false);
    //   component.generateConfigFileForOrder();
    //   tick();
    //   expect(component.isConfigFileLoaded).toBe(false);
    // }));

    // TODO: update test
    // it('should call _showErrorSnackbar when _orderService.generateConfigTemplateFileForOrder return error', fakeAsync(() => {
    //   getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncError({ message: {} }));
    //   expect(component._showErrorSnackbar).not.toHaveBeenCalled();
    //   component.generateConfigFileForOrder();
    //   tick();
    //   expect(component._showErrorSnackbar).toHaveBeenCalled();
    // }));

    it('should NOT call _showErrorSnackbar when _orderService.generateConfigTemplateFileForOrder success return value', fakeAsync(() => {
      getOrderServiceGenerateConfigTemplateFileForOrder().mockReturnValue(asyncData(mockFile));
      expect(component._showErrorSnackbar).not.toHaveBeenCalled();
      component.generateConfigFileForOrder();
      tick();
      expect(component._showErrorSnackbar).not.toHaveBeenCalled();
    }));
  });
});
