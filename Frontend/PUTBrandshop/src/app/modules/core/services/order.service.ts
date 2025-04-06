import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  GetOrderAdminResponse,
  GetOrderResponse,
  GetOrdersResponse,
  OrderResponse,
  PostOrder,
  PostOrderResponse,
} from '../models/order.model';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  addOrder(body: PostOrder): Observable<PostOrderResponse> {
    return this.http
      .post<PostOrderResponse>(`${this.apiUrl}`, body, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          window.location.href = response.redirectUri;
        })
      );
  }

  getOrder(uuid: string): Observable<GetOrderResponse> {
    const params = new HttpParams().append('uuid', uuid);
    return this.http.get<GetOrderResponse>(`${this.apiUrl}`, {
      params,
    });
  }

  getOrders(): Observable<GetOrdersResponse[]> {
    return this.http.get<GetOrdersResponse[]>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }

  getOrdersAdmin(
    pageIndex = 1,
    itemsPerPage = 15
  ): Observable<GetOrderAdminResponse> {
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);
    return this.http
      .get<GetOrderResponse[]>(`${this.apiUrl}/order-list`, {
        observe: 'response',
        params,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (!response.body) {
            return { orders: [], totalCount: 0 };
          } else {
            const totalCount = Number(response.headers.get('X-Total-Count'));
            return { orders: [...response.body], totalCount };
          }
        })
      );
  }

  changeStatus(uuid: string, status: string): Observable<OrderResponse> {
    let params = new HttpParams().append('uuid', uuid).append('status', status);
    return this.http.patch<OrderResponse>(
      `${this.apiUrl}/status-set`,
      {},
      { withCredentials: true, params }
    );
  }

  changeStatusName(name: string) {
    switch (name) {
      case 'PENDING': {
        return 'Zamówienie złożone';
      }

      case 'WAITING_FOR_CONFIRMATION': {
        return 'Oczekuje na potwierdzenie';
      }

      case 'COMPLETED': {
        return 'Zamówienie złożone';
      }

      case 'PAID': {
        return 'Zamówienie opłacone';
      }

      case 'CANCELED': {
        return 'Zamówienie anulowane';
      }

      case 'SENT': {
        return 'Zamówienie wysłane';
      }

      case 'DELIVERED': {
        return 'Zamówienie zrealizowane';
      }

      case 'RETURNED': {
        return 'Zamówienie zwrócone';
      }

      case 'READY': {
        return 'Gotowe do odbioru';
      }

      default:
        return '';
    }
  }
}
