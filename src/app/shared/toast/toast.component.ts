import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="true">
      <div *ngFor="let toast of notificationService.notifications()" class="toast-card" [ngClass]="toast.type">
        <div class="toast-message">{{ toast.message }}</div>
        <button type="button" class="toast-close" (click)="notificationService.dismiss(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-stack {
        position: fixed;
        right: 18px;
        top: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1500;
        width: clamp(280px, 18vw, 360px);
      }

      .toast-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-radius: 14px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
        color: #fff;
        font-size: 0.95rem;
        backdrop-filter: blur(10px);
        min-height: 58px;
      }

      .toast-card.info { background: linear-gradient(135deg, #4f8cff, #3171ff); }
      .toast-card.success { background: linear-gradient(135deg, #0fbc76, #0b9d5b); }
      .toast-card.warning { background: linear-gradient(135deg, #f6a700, #f97e01); }
      .toast-card.error { background: linear-gradient(135deg, #e03a3a, #bd1d1d); }

      .toast-message {
        flex: 1;
        margin-right: 12px;
      }

      .toast-close {
        border: none;
        background: transparent;
        color: #fff;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        opacity: 0.8;
      }

      .toast-close:hover {
        opacity: 1;
      }
    `
  ]
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
