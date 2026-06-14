import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [class.no-padding]="noPadding">
      <div class="stat-content">
        <div class="stat-icon" [ngClass]="iconColor">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ value }}</div>
          <div class="stat-label">{{ label }}</div>
        </div>
      </div>
      <div class="stat-footer" *ngIf="footer">{{ footer }}</div>
    </mat-card>
  `,
  styles: [
    `
      .stat-card {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
        transition: all 0.2s ease;
        cursor: default;

        &:hover {
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
          transform: translateY(-2px);
        }
      }

      .stat-card.no-padding {
        padding: 0;
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;

        &.primary { background: linear-gradient(135deg, #4f8cff, #3171ff); color: white; }
        &.success { background: linear-gradient(135deg, #0fbc76, #0b9d5b); color: white; }
        &.warning { background: linear-gradient(135deg, #f6a700, #f97e01); color: white; }
        &.danger { background: linear-gradient(135deg, #e03a3a, #bd1d1d); color: white; }
        &.info { background: linear-gradient(135deg, #9b6ad8, #7c3aed); color: white; }
      }

      .stat-info {
        flex: 1;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
      }

      .stat-label {
        font-size: 13px;
        color: #64748b;
        margin-top: 4px;
      }

      .stat-footer {
        padding: 12px 20px;
        background: #f8fafc;
        font-size: 12px;
        color: #475569;
        border-top: 1px solid #e2e8f0;
      }
    `
  ]
})
export class StatCardComponent {
  @Input() icon = 'trending_up';
  @Input() label = 'Metric';
  @Input() value: string | number = '0';
  @Input() footer: string | null = null;
  @Input() iconColor = 'primary';
  @Input() noPadding = false;
}
