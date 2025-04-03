import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AuthResponse,
  GetUsersAdminResponse,
  IUser,
  LoggedInResponse,
  LoginData,
  RecoveryPasswordData,
  RegisterData,
  ResetPasswordData,
  UserAdminis,
} from '../models/auth.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(body: LoginData): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/login`, body, {
      withCredentials: true,
    });
  }

  logout(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/logout`, {
      withCredentials: true,
    });
  }

  autoLogin(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/auto-login`, {
      withCredentials: true,
    });
  }

  isLoggedIn(): Observable<LoggedInResponse> {
    return this.http.get<LoggedInResponse>(`${this.apiUrl}/logged-in`, {
      withCredentials: true,
    });
  }

  register(body: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body);
  }

  activateAccount(uid: string): Observable<AuthResponse> {
    const params = new HttpParams().append('uid', uid);
    return this.http.get<AuthResponse>(`${this.apiUrl}/activate`, { params });
  }

  resetPassword(body: RecoveryPasswordData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/reset-password`, body);
  }

  changePassword(body: ResetPasswordData): Observable<AuthResponse> {
    return this.http.patch<AuthResponse>(`${this.apiUrl}/reset-password`, body);
  }

  lockUser(uuid: string, login: string): Observable<AuthResponse> {
    return this.http.patch<AuthResponse>(
      `${this.apiUrl}/set-lock`,
      {
        uid: uuid,
        login: login,
        lock: true,
      },
      { withCredentials: true }
    );
  }

  unlockUser(uuid: string, login: string): Observable<AuthResponse> {
    return this.http.patch<AuthResponse>(
      `${this.apiUrl}/set-lock`,
      {
        uid: uuid,
        login: login,
        lock: false,
      },
      { withCredentials: true }
    );
  }

  changeRole(
    uuid: string,
    login: string,
    role: string
  ): Observable<AuthResponse> {
    return this.http.patch<AuthResponse>(
      `${this.apiUrl}/set-role`,
      {
        uid: uuid,
        login: login,
        role: role,
      },
      { withCredentials: true }
    );
  }

  getUsersAdmin(
    pageIndex = 1,
    itemsPerPage = 15,
    name: string | null = null,
    sortUser: string | null = null,
    orderUser: string | null = null
  ): Observable<GetUsersAdminResponse> {
    // eslint-disable-next-line prefer-const
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);

    if (name) {
      params = params.append('name_like', name);
    }

    if (sortUser) {
      params = params.append('_sort', sortUser);
    }

    if (orderUser) {
      params = params.append('_order', orderUser);
    }

    return this.http
      .get<UserAdminis[]>(`${this.apiUrl}/admin-get`, {
        observe: 'response',
        params,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (!response.body) {
            return { users: [], totalCount: 0 };
          } else {
            const totalCount = Number(response.headers.get('X-Total-Count'));
            return { users: [...response.body], totalCount };
          }
        })
      );
  }
}
