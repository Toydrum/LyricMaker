import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      logger.error('HTTP error', error.status, error.message);
      return throwError(() => error);
    })
  );
};
