/* eslint-disable @ngrx/prefer-effect-callback-in-block-statement */
import { AuthService } from '../../core/services/auth.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, map, of, switchMap } from 'rxjs';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) => {
        return this.authService.login(action.loginData).pipe(
          map((user) => {
            if (user.login) {
              this.router.navigate(['/']);
              this.notifierService.notify('success', `Witaj ${user.login}`);
              return AuthActions.loginSuccess({ user: { ...user } });
            } else {
              return AuthActions.loginFailure({ error: 'error login' });
            }
          }),
          catchError((err) => {
            return of(AuthActions.loginFailure({ error: err }));
          })
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        return this.authService.logout().pipe(
          map(() => {
            this.router.navigate(['/logowanie']);
            this.notifierService.notify('success', `Wylogowano się`);
            return AuthActions.logoutSuccess();
          }),
          catchError((err) => {
            this.notifierService.notify('warning', err);
            return of(AuthActions.logoutFailure());
          })
        );
      })
    )
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(() => {
        return this.authService.autoLogin().pipe(
          map((user) => {
            return AuthActions.autoLoginSuccess({ user: { ...user } });
          }),
          catchError(() => of(AuthActions.autoLoginFailure()))
        );
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((action) => {
        return this.authService.register(action.registerData).pipe(
          map((user) => {
            this.router.navigate(['/logowanie']);
            this.notifierService.notify(
              'success',
              'Rejestracja zakończona sukcesem! Aktywuj konto za pomocą adresu e-mail.'
            );
            return AuthActions.registerSuccess();
          }),
          catchError((err) => {
            return of(AuthActions.registerFailure({ error: err }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}
}
