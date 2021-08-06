import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { OrderService } from '@tigerq-frontend/portal/core/services/order.service';
import { CartService } from '@tigerq-frontend/core/services';
import { catchError, filter } from 'rxjs/operators';
import {
  CartItemInterface,
  GenerateConfigTemplateFileRequestInterface,
  ProductItemInterface,
} from '@tigerq-frontend/core/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileInterface } from '@tigerq-frontend/core/interfaces';
import { MatSnackBarConfig } from '@angular/material/snack-bar/snack-bar-config';
import {
  CommonSnackbarComponent,
  CommonSnackbarService,
  ConfigFileValidationErrorDialogComponent,
} from '@tigerq-frontend/shared';
import { createProductItemByCount, isEqual } from '@tigerq-frontend/helpers';
import { MatSnackBarRef } from '@angular/material/snack-bar/snack-bar-ref';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsTextConstants } from '@tigerq-frontend/core/constants';

interface UploadUserFileError {
  messages: string[];
}

interface DataForGenerateConfigFileInterface {
  product_id: number;
  product_count: number;
  product_items: ProductItemInterface[];
}

@UntilDestroy()
@Component({
  selector: 'tq-config-file-upload',
  templateUrl: './config-file-upload.component.html',
  styleUrls: ['./config-file-upload.component.scss'],
})
export class ConfigFileUploadComponent implements OnInit, OnDestroy {
  public productsInCart: CartItemInterface[] = [];
  public isConfigFilesUploadProcess: boolean = false;
  public uploadedConfigFile: FileInterface;
  public uploadUserFilesErrors: UploadUserFileError;
  public accept: string = '.xlsx, .xls, .csv';
  public configFileDownload: string;
  public isConfigFileLoaded: boolean = false;
  public configFile: Blob;
  public products: DataForGenerateConfigFileInterface[] = [];
  public _onChangesProductsPriceSnackbarRef: MatSnackBarRef<CommonSnackbarComponent>;
  public isConfig: boolean = true;
  public errors: string[];

  @Output() public configFileIsUploaded: EventEmitter<number | null> = new EventEmitter<number | null>();

  constructor(
    public readonly _orderService: OrderService,
    public readonly _cartService: CartService,
    public readonly _commonSnackbarService: CommonSnackbarService,
    public readonly _matDialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this._getItemsInCart();
  }

  public ngOnDestroy(): void {
    if (this._onChangesProductsPriceSnackbarRef) {
      this._onChangesProductsPriceSnackbarRef.dismiss();
    }
  }

  public get uploadFilesErrors(): UploadUserFileError {
    return this.uploadUserFilesErrors;
  }

  public get uploadedUserFiles(): FileInterface {
    return this.uploadedConfigFile;
  }

  public _getItemsInCart(): void {
    this.isConfigFileLoaded = false;
    this._cartService
      .getItemsInCart()
      .pipe(
        untilDestroyed(this),
        filter(res => !!res.length),
      )
      .subscribe(res => {
        if (!isEqual(this.productsInCart, res) && !this.configFile && !this.productsInCart.length) {
          this.productsInCart = res;
          this.generateConfigFileForOrder();
        }
      });
  }

  public createDataForGenerateConfigFile(needToUpdate: boolean = false): GenerateConfigTemplateFileRequestInterface {
    this.products = this.productsInCart
      .filter(product => !!product.information_required)
      .map(product => {
        if (needToUpdate) {
          const newProductItems = createProductItemByCount(product.quantity);
          this._cartService.updateCartItem({ ...product, product_items: newProductItems }, false);
          return {
            product_id: product.id,
            product_count: product.quantity,
            product_items: newProductItems,
          };
        } else {
          return {
            product_id: product.id,
            product_count: product.quantity,
            product_items: product.product_items,
          };
        }
      });

    if (this.products.length) {
      return { order_products: [...this.products] };
    }
  }

  public generateConfigFileForOrder(): void {
    this._orderService
      .generateConfigTemplateFileForOrder(this.createDataForGenerateConfigFile())
      .pipe(
        untilDestroyed(this),
        catchError(error => {
          const decodedString = String.fromCharCode.apply(null, new Uint8Array(error));
          const obj = JSON.parse(decodedString);
          if (obj.order_products) {
            return this._orderService.generateConfigTemplateFileForOrder(this.createDataForGenerateConfigFile(true));
          }
        }),
      )
      .subscribe(
        res => {
          this.configFile = res;
          this.configFileDownload = 'config.xlsx';
          this.isConfigFileLoaded = true;
        },
        error => {
          const decodedString = String.fromCharCode.apply(null, new Uint8Array(error));
          const obj = JSON.parse(decodedString);
          this._showErrorSnackbar(obj.message);
        },
      );
  }

  public downloadConfigFile(): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(this.configFile);
    link.href = url;
    link.download = `config.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public onUserFilesUploadProcess(value: boolean): void {
    this.isConfigFilesUploadProcess = value;
  }

  public onUploadedFilesChange(file: FileInterface): void {
    this.uploadedConfigFile = file;

    if (this.uploadedConfigFile) {
      this.configFileIsUploaded.emit(this.uploadedConfigFile.id);
    } else {
      this.configFileIsUploaded.emit(null);
    }
  }

  public validateUploadConfigFile(file: FileInterface): void {
    this._orderService
      .validateUploadConfigFile(file.id)
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.onUploadedFilesChange(file);
          this.errors = null;
        },
        errors => {
          if (errors && errors.non_field_errors) {
            this.errors = errors.non_field_errors;
            this._showErrorSnackbar(NotificationsTextConstants.configFileCommonError);
          } else if (errors) {
            this._showConfigFileValidationErrorsNotification(errors);
          }
        },
      );
  }

  public onUserFilesErrorsChange(errors: string[]): void {
    this.uploadUserFilesErrors = {
      messages: errors,
    };
  }

  public _showErrorSnackbar(message: string, config?: MatSnackBarConfig): void {
    this._commonSnackbarService.showError(message, config);
  }

  public onRemoveConfigFile(): void {
    this.uploadedConfigFile = null;
    this.configFileIsUploaded.emit(null);
  }

  public _showConfigFileValidationErrorsNotification(message: string): void {
    this._onChangesProductsPriceSnackbarRef = this._commonSnackbarService.showInfo(message, {
      duration: 0,
    });
  }

  public showValidationErrorsDetail(): void {
    this._matDialog.open(ConfigFileValidationErrorDialogComponent, { data: this.errors });
  }
}
