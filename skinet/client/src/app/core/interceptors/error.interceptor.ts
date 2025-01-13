import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        if (err.error.errors) {
          const modelStateErrors = [];
          for (const key in err.error.errors) {
            if (err.error.errors[key]) {
              modelStateErrors.push(err.error.errors[key])
            }
          }
          throw modelStateErrors.flat();
        } else {
          snackbar.error(err.error.title || err.error);
        }
      }
      if(err.status === 401) {
        snackbar.error(err.error.title || err.error);
      }
      if(err.status === 404) {
        router.navigateByUrl('/not-found');
      }
      if(err.status === 500) {
        router.navigateByUrl('/server-error');
      }
      return throwError(() => err);
    })
  );
};
