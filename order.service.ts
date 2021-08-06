import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page, PageRequest } from 'ngx-pagination-data-source';
import { OrderListInterface } from '../interfaces/order/order-list.interface';
import {
  ApiPaginationResponseInterface,
  OrderInterface,
  PaginationCommonQueryInterface,
} from '@tigerq-frontend/core/interfaces';
import { createHttpParams, getMappedPaginationResponse, getParams } from '@tigerq-frontend/helpers';
import { OrderDetailInterface } from '../interfaces/order/order-detail.interface';
import { CurrentUserInterface } from '../interfaces/user/current-user.interface';
import { OrderProductStatusesEnum } from '@tigerq-frontend/core/enums';
import { ProductForOrderDetailInterface } from '../interfaces/product/product-for-order-detail.interface';
import { ResultsFileResponseInterface } from '../interfaces/results-file-response.interface';
import { UserListInterface } from '../interfaces/user/user-list.interface';
import { CreateOrderByInvoiceInterface } from '../interfaces/order/create-order-by-invoice.interface';

@Injectable()
export class OrderService {
  public isOrderListUpdate$: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(HttpClient) private readonly http: HttpClient) {}

  public getOrderList(
    request: PageRequest<OrderListInterface>,
    query: PaginationCommonQueryInterface,
  ): Observable<Page<OrderListInterface>> {
    const httpParams: HttpParams = createHttpParams(getParams<OrderListInterface>(request, query));

    return this.http
      .get<ApiPaginationResponseInterface<OrderListInterface>>(`/api/admin/orders/`, {
        params: httpParams,
      })
      .pipe(
        map((response: ApiPaginationResponseInterface<OrderListInterface>) =>
          getMappedPaginationResponse<OrderListInterface>(response, request),
        ),
      );
  }

  public getOrderDetail(id: number): Observable<OrderDetailInterface> {
    return this.http.get<OrderDetailInterface>(`/api/admin/orders/${id}/`);
  }

  public getInvestigators(
    query: PaginationCommonQueryInterface,
  ): Observable<ApiPaginationResponseInterface<CurrentUserInterface>> {
    const request: PageRequest<CurrentUserInterface> = {
      page: 0,
      size: 40,
      sort: { property: 'email', order: 'asc' },
    };
    const httpParams: HttpParams = createHttpParams(getParams<CurrentUserInterface>(request, query));
    return this.http.get<ApiPaginationResponseInterface<CurrentUserInterface>>('/api/admin/admins/', {
      params: httpParams,
    });
  }

  public setInvestigatorForOrderProduct(
    orderId: number,
    productId: number,
    investigatorId: number,
  ): Observable<{ id: number; investigator: number; status?: OrderProductStatusesEnum }> {
    return this.http.patch<{ id: number; investigator: number; status?: OrderProductStatusesEnum }>(
      `/api/admin/orders/${orderId}/products/${productId}/investigator/`,
      { investigator: investigatorId },
    );
  }

  public changeReceivedStatusForOrderProduct(
    orderId: number,
    productId: number,
    received: boolean,
  ): Observable<{ id: number; received: boolean }> {
    return this.http.patch<{ id: number; received: boolean }>(
      `/api/admin/orders/${orderId}/products/${productId}/received/`,
      { received },
    );
  }

  public deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/orders/${id}/`);
  }

  public getOrderProductsForInvestigation(
    request: PageRequest<ProductForOrderDetailInterface>,
    query: PaginationCommonQueryInterface,
  ): Observable<Page<ProductForOrderDetailInterface>> {
    const httpParams: HttpParams = createHttpParams(getParams<ProductForOrderDetailInterface>(request, query));

    return this.http
      .get<ApiPaginationResponseInterface<ProductForOrderDetailInterface>>(
        `/api/admin/orders/products/investigation/`,
        {
          params: httpParams,
        },
      )
      .pipe(
        map((response: ApiPaginationResponseInterface<ProductForOrderDetailInterface>) =>
          getMappedPaginationResponse<ProductForOrderDetailInterface>(response, request),
        ),
      );
  }

  public markProductAsDone(id: number): Observable<void> {
    return this.http.post<void>(`/api/admin/orders/products/investigation/${id}/complete/`, {});
  }

  public cancelProduct(id: number): Observable<void> {
    return this.http.post<void>(`/api/admin/orders/products/investigation/${id}/cancel/`, {});
  }

  public takeProductInWork(id: number): Observable<void> {
    return this.http.post<void>(`/api/admin/orders/products/investigation/${id}/take-in-work/`, {});
  }

  public generateResultsFile(): Observable<Blob> {
    return this.http
      .post<Blob>(`/api/admin/orders/products/investigation/results/generate/`, {}, { responseType: 'blob' as 'json' })
      .pipe(
        map(data => {
          return new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
        }),
      );
  }

  public sendResultsFile(formData: FormData): Observable<ResultsFileResponseInterface> {
    return this.http.post<ResultsFileResponseInterface>(
      `/api/admin/orders/products/investigation/results/upload/`,
      formData,
    );
  }

  public getCustomers(
    query: PaginationCommonQueryInterface,
  ): Observable<ApiPaginationResponseInterface<UserListInterface>> {
    const request: PageRequest<UserListInterface> = {
      page: 0,
      size: 50,
      sort: { property: 'first_name', order: 'asc' },
    };
    const httpParams: HttpParams = createHttpParams(getParams<UserListInterface>(request, query));

    return this.http.get<ApiPaginationResponseInterface<UserListInterface>>('/api/admin/users/', {
      params: httpParams,
    });
  }

  public createOrder(data: CreateOrderByInvoiceInterface): Observable<OrderInterface> {
    return this.http.post<OrderInterface>('/api/admin/orders/', data);
  }

  public updateOrderStatus(id: number): Observable<OrderDetailInterface> {
    return this.http.post<OrderDetailInterface>(`/api/admin/orders/${id}/update-status/`, {});
  }
}
