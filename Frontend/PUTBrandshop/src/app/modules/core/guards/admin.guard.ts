/* eslint-disable @ngrx/avoid-mapping-selectors */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../auth/store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((response) => {
        const isLoggedIn = response.access;
        if (isLoggedIn) {
          return this.store.select(selectAuthUser).pipe(
            map((user) => {
              if (user && user.role === 'ADMIN') {
                return true;
              }
              return false;
            }),
          );
        }
        return of(false);
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }
}
