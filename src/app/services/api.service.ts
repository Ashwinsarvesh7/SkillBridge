import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          httpParams = httpParams.set(k, String(v));
        }
      });
    }
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(map(r => this.unwrap(r)), catchError(e => this.handleError(e)));
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => this.unwrap(r)), catchError(e => this.handleError(e)));
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => this.unwrap(r)), catchError(e => this.handleError(e)));
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => this.unwrap(r)), catchError(e => this.handleError(e)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(map(r => this.unwrap(r, true)), catchError(e => this.handleError(e)));
  }

  upload<T>(path: string, file: File): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, formData)
      .pipe(map(r => this.unwrap(r)), catchError(e => this.handleError(e)));
  }

  private unwrap<T>(response: ApiResponse<T>, allowNull = false): T {
    if (!response?.success || (!allowNull && response.data == null)) {
      throw new Error(response?.message || 'Request failed');
    }
    return response.data as T;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Request failed';

    if (error.status === 0) {
      message = 'Cannot reach the API. Start the backend: cd skillbridge-backend → .\\mvnw.cmd spring-boot:run';
    } else if (error.status === 401) {
      message = error.error?.message || 'Invalid email or password';
    } else if (error.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }

    return throwError(() => new Error(message));
  }
}
