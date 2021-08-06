import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@tigerq-frontend/portal/core/services/products.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ApiDataSource } from '@tigerq-frontend/core/api-data-source';
import { CartItemInterface, ProductInterface } from '@tigerq-frontend/core/interfaces';
import { ProductTypeEnum } from '@tigerq-frontend/core/enums';
import { CartService, InfiniteScrollService } from '@tigerq-frontend/core/services';
import { CommonSnackbarService } from '@tigerq-frontend/shared';
import { NotificationsTextConstants } from '@tigerq-frontend/core/constants';

@UntilDestroy()
@Component({
  selector: 'tq-analyzes-list-page',
  templateUrl: './analyzes-list-page.component.html',
  styleUrls: ['./analyzes-list-page.component.scss'],
})
export class AnalyzesListPageComponent implements OnInit {
  public dataSource: ApiDataSource<ProductInterface>;
  public isInitialLoading: boolean = true;
  public readonly infiniteScrollOptions = {
    ...this._infiniteScrollService.getBasicOptions(),
    pageSize: 5,
  };

  constructor(
    public readonly _cartService: CartService,
    public readonly _productsService: ProductsService,
    public readonly _infiniteScrollService: InfiniteScrollService,
    public readonly _commonSnackbarService: CommonSnackbarService,
  ) {}

  public ngOnInit(): void {
    this._initDataSource();
  }

  public _initDataSource(): void {
    this.dataSource = new ApiDataSource<ProductInterface>(params => this._productsService.getProducts(params), {
      pageSize: this.infiniteScrollOptions.pageSize,
      filter: { type: ProductTypeEnum.analysis },
    });
  }

  public trackByFn(index: number, item: ProductInterface): number {
    return item.id;
  }

  public onScrollDown(): void {
    this.dataSource.nextPage();
  }

  public addCartItemToStorage(cartItem: CartItemInterface): void {
    this._cartService.addItemToCart(cartItem);
    this._showSuccessSnackbar(NotificationsTextConstants.productAddedToCartSuccess);
  }

  public updateItemInStorage(cartItem: CartItemInterface): void {
    this._cartService.updateCartItem(cartItem);
  }

  public _showSuccessSnackbar(message: string): void {
    this._commonSnackbarService.showSuccess(message);
  }
}
