import { CartPayPanelComponent } from './cart-pay-panel.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from '@tigerq-frontend/core/services';
import { CartServiceMock } from '@tigerq-frontend/portal/core/testing/cart.service.mock';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrencyService } from '@tigerq-frontend/core/services';
import { CurrencyServiceMock } from '@tigerq-frontend/core/mocks';
import { RouterTestingModule } from '@angular/router/testing';

/* eslint-disable @typescript-eslint/unbound-method */
describe('CartPayPanelComponent', () => {
  let component: CartPayPanelComponent;
  let fixture: ComponentFixture<CartPayPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CartPayPanelComponent],
      providers: [
        {
          provide: CartService,
          useClass: CartServiceMock,
        },
        {
          provide: CurrencyService,
          useClass: CurrencyServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPayPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'getTotalCartPrice').mockImplementation(() => null);
      jest.spyOn(component._currencyService, 'getCurrencySymbol').mockImplementation(() => null);
    });

    it('should call getTotalCartPrice()', () => {
      expect(component.getTotalCartPrice).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(component.getTotalCartPrice).toHaveBeenCalled();
    });
  });

  describe('getTotalCartPrice()', () => {
    it('should call _cartService.totalCartPrice$.next()', () => {
      component._cartService._totalCartPrice$ = new BehaviorSubject<number>(0);
      const spy = jest.spyOn(component._cartService._totalCartPrice$, 'next');
      component.getTotalCartPrice();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('payByCard()', () => {
    it('should call byCard.emit()', () => {
      component.byCard = new EventEmitter<boolean>() as any;
      const spy = jest.spyOn(component.byCard, 'emit');
      component.payByCard();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('payByInvoice()', () => {
    it('should call byInvoice.emit()', () => {
      component.byInvoice = new EventEmitter<boolean>() as any;
      const spy = jest.spyOn(component.byInvoice, 'emit');
      component.payByInvoice();
      expect(spy).toHaveBeenCalled();
    });
  });
});
