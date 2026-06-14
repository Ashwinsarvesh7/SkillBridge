import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Notification } from '../models';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  notifications = signal<ToastMessage[]>([]);
  private nextId = 1;

  getAll() {
    return this.api.get<Notification[]>('/notifications');
  }

  markRead(id: number) {
    return this.api.patch<void>(`/notifications/${id}/read`, {});
  }

  markAllRead() {
    return this.api.patch<void>('/notifications/read-all', {});
  }

  notify(message: string, type: ToastType = 'info', duration = 4500): void {
    const id = this.nextId++;
    this.notifications.update(current => [...current, { id, message, type }]);
    window.setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.notify(message, 'success');
  }

  error(message: string): void {
    this.notify(message, 'error');
  }

  dismiss(id: number): void {
    this.notifications.update(current => current.filter(item => item.id !== id));
  }
}
