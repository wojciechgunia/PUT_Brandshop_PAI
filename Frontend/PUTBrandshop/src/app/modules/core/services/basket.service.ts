import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  BasketResponse,
  GetBasketResponse,
  PostBasketBody,
} from '../models/basket.model';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ServerResponse } from '../models/server-response.model';

function extractResponse(
  response: HttpResponse<ServerResponse | GetBasketResponse>,
): BasketResponse {
  if (!response.body) {
    return { body: null, totalCount: 0 };
  } else {
    const totalCount = Number(response.headers.get('X-Total-Count'));
    return { body: { ...response.body }, totalCount };
  }
}

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  apiUrl = `${environment.apiUrl}/basket`;
  totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  addProductToBasket(body: PostBasketBody): Observable<BasketResponse> {
    return this.http
      .post<ServerResponse>(`${this.apiUrl}`, body, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map(extractResponse),
        tap(({ totalCount }) => {
          this.totalCount$.next(totalCount);
        }),
      );
  }

  getBasketProducts(): Observable<BasketResponse> {
    return this.http
      .get<GetBasketResponse>(`${this.apiUrl}`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map(extractResponse),
        tap(({ body, totalCount }) => {
          this.totalCount$.next(totalCount);
        }),
      );
  }

  deleteProductToBasket(uuid: string): Observable<BasketResponse> {
    const params = new HttpParams().append('uuid', uuid);
    return this.http
      .delete<ServerResponse>(`${this.apiUrl}`, {
        withCredentials: true,
        observe: 'response',
        params,
      })
      .pipe(
        map(extractResponse),
        tap(({ totalCount }) => {
          this.totalCount$.next(totalCount);
        }),
      );
  }
}
