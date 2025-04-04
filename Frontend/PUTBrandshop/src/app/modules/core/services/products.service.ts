import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AddProductData,
  GetProductAdminResponse,
  GetProductResponse,
  PostProductResponse,
  PrimitiveProduct,
  Product,
  ProductResponse,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getProduct(name: string, date: string): Observable<Product> {
    const params = new HttpParams()
      .append('name_like', name)
      .append('data', date);

    return this.http.get<Product>(`${this.apiUrl}`, {
      params,
    });
  }

  getProducts(
    pageIndex = 1,
    itemsPerPage = 10,
    name: string | null = null,
    sortProduct: string | null = null,
    orderProduct: string | null = null,
    category: string | null = null
  ): Observable<GetProductResponse> {
    // eslint-disable-next-line prefer-const
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);

    if (name) {
      params = params.append('name_like', name);
    }

    if (sortProduct) {
      params = params.append('_sort', sortProduct);
    }

    if (orderProduct) {
      params = params.append('_order', orderProduct);
    }

    if (category) {
      params = params.append('_category', category);
    }

    return this.http
      .get<PrimitiveProduct[]>(`${this.apiUrl}`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          if (!response.body) {
            return { products: [], totalCount: 0 };
          } else {
            const totalCount = Number(response.headers.get('X-Total-Count'));
            return { products: [...response.body], totalCount };
          }
        })
      );
  }

  getProductsAdmin(
    pageIndex = 1,
    itemsPerPage = 15,
    name: string | null = null,
    sortProduct: string | null = null,
    orderProduct: string | null = null,
    category: string | null = null
  ): Observable<GetProductAdminResponse> {
    // eslint-disable-next-line prefer-const
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);

    if (name) {
      params = params.append('name_like', name);
    }

    if (sortProduct) {
      params = params.append('_sort', sortProduct);
    }

    if (orderProduct) {
      params = params.append('_order', orderProduct);
    }

    if (category) {
      params = params.append('_category', category);
    }

    return this.http
      .get<Product[]>(`${this.apiUrl}/admin-get`, {
        observe: 'response',
        params,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (!response.body) {
            return { products: [], totalCount: 0 };
          } else {
            const totalCount = Number(response.headers.get('X-Total-Count'));
            return { products: [...response.body], totalCount };
          }
        })
      );
  }

  addProduct(addProductData: AddProductData): Observable<PostProductResponse> {
    return this.http.post<PostProductResponse>(
      `${this.apiUrl}`,
      addProductData,
      {
        withCredentials: true,
      }
    );
  }

  deleteProduct(uid: string): Observable<ProductResponse> {
    const params = new HttpParams().append('uid', uid);
    return this.http.delete<ProductResponse>(`${this.apiUrl}`, {
      params,
      withCredentials: true,
    });
  }

  editProduct(
    addProductData: AddProductData,
    uid: string
  ): Observable<PostProductResponse> {
    let params = new HttpParams().append('uid', uid);
    return this.http.patch<PostProductResponse>(
      `${this.apiUrl}`,
      addProductData,
      {
        withCredentials: true,
        params,
      }
    );
  }
}
