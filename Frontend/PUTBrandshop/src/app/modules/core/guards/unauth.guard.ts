import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
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
      map((response) => {
        const isLoggedIn = response.access;
        if (isLoggedIn) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        return of(true);
      }),
    );
  }
}
