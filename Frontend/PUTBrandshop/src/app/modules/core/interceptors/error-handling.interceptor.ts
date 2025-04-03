import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = '';
        if (err.status >= 400 && err.status < 500) {
          errorMsg = err.error.message || 'Wystąpił błąd. Spróbuj ponownie.';
        } else {
          errorMsg = 'Wystąpił błąd. Spróbuj ponownie.';
        }
        return throwError(errorMsg);
      }),
    );
  }
}
