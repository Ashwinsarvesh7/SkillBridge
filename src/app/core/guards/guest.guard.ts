import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/** Redirect logged-in users away from login/register. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return true;
  }
  if (auth.currentUser()) {
    return router.createUrlTree(['/dashboard']);
  }
  // Token without user (corrupt session) — clear and show login
  auth.invalidateSession();
  return true;
};
