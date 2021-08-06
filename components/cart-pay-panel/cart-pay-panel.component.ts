import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '@tigerq-frontend/core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CurrencyService } from '@tigerq-frontend/core/services';

@UntilDestroy()
@Component({
  selector: 'tq-cart-pay-panel',
  templateUrl: './cart-pay-panel.component.html',
  styleUrls: ['./cart-pay-panel.component.scss'],
})
export class CartPayPanelComponent implements OnInit {
  public totalCartPrice: number;
  public prefix: string = '';

  @Input() public isUserAuthenticated: boolean = true;
  @Input() public isCheckoutFileProcess: boolean = false;
  @Input() public isPayButtonsDisabled: boolean = false;
  @Input() public isInformationRequired: boolean = false;
  @Output() public byCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public byInvoice: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public checkoutProcess: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public readonly _cartService: CartService, public readonly _currencyService: CurrencyService) {}

  public ngOnInit(): void {
    this.getTotalCartPrice();
  }

  public getTotalCartPrice(): void {
    this.prefix = this._currencyService.getCurrencySymbol();
    this._cartService._totalCartPrice$.next(this._cartService.countTotalCartPrice());
    this._cartService
      .getTotalCartPrice()
      .pipe(untilDestroyed(this))
      .subscribe(count => {
        this.totalCartPrice = count;
      });
  }

  public payByCard(): void {
    this.byCard.emit(true);
  }

  public payByInvoice(): void {
    this.byInvoice.emit(true);
  }

  public checkoutFile(): void {
    this.checkoutProcess.emit(true);
  }
}
