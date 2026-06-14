import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'sb_token';
  private readonly USER_KEY = 'sb_user';

  currentUser = signal<User | null>(this.loadUser());

  register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(res => this.setSession(res)),
      switchMap(() => from(this.router.navigateByUrl('/dashboard', { replaceUrl: true })))
    );
  }

  /** Clear stored credentials without routing (used by guards). */
  invalidateSession(): void {
    this.clearSession();
    this.currentUser.set(null);
  }

  logout(): void {
    this.invalidateSession();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    if (this.isTokenExpired(token)) {
      this.invalidateSession();
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private parseTokenPayload<T>(token: string): T | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(decoded))) as T;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.parseTokenPayload<{ exp: number }>(token);
    return !payload || (payload.exp * 1000) < Date.now();
  }

  updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private setSession(res: AuthResponse): void {
    if (!res?.token || !res?.user) {
      throw new Error('Login response was incomplete. Check that the backend is running.');
    }
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      this.clearSession();
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
