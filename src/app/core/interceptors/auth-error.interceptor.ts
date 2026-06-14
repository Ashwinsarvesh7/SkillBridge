import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notification = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: any) => {
      const status = error?.status;
      const message = error?.error?.message || error?.message || 'Something went wrong';

      if (status === 401 || status === 403) {
        auth.invalidateSession();
        notification.notify('Your session has expired or is not authorized. Please sign in again.', 'error');
        router.navigate(['/auth/login']);
      } else {
        notification.notify(message, 'warning');
      }

      return throwError(() => new Error(message));
    })
  );
};
