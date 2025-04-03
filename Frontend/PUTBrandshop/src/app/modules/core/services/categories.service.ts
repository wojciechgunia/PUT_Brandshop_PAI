import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Category,
  CategoryResponse,
  GetCategoryAdminResponse,
  PostCategory,
} from '../models/categories.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  categories = new BehaviorSubject<Category[]>([]);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`).pipe(
      tap((categories) => {
        this.categories.next(categories);
      })
    );
  }

  addCategory(
    body: PostCategory
  ): Observable<{ timestamp: string; message: string }> {
    return this.http.post<{ timestamp: string; message: string }>(
      `${this.apiUrl}`,
      body,
      {
        withCredentials: true,
      }
    );
  }

  getCategoriesAdmin(
    pageIndex = 1,
    itemsPerPage = 15,
    name: string | null = null
  ): Observable<GetCategoryAdminResponse> {
    // eslint-disable-next-line prefer-const
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);

    if (name) {
      params = params.append('name_like', name);
    }

    return this.http
      .get<Category[]>(`${this.apiUrl}/get-admin`, {
        observe: 'response',
        params,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          console.log(response);
          if (!response.body) {
            return { categories: [], totalCount: 0 };
          } else {
            const totalCount = Number(response.headers.get('X-Total-Count'));
            return { categories: [...response.body], totalCount };
          }
        })
      );
  }

  deleteCategory(uid: string): Observable<CategoryResponse> {
    const params = new HttpParams().append('shortID', uid);
    return this.http.delete<CategoryResponse>(`${this.apiUrl}`, {
      params,
      withCredentials: true,
    });
  }
}
