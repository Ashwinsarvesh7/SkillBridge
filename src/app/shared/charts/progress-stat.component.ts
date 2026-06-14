import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-stat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-stat">
      <div class="stat-header">
        <span class="label">{{ label }}</span>
        <span class="value">{{ current | number }}{{ unit }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" [style.width]="percentage + '%'"></div>
      </div>
      <div class="stat-footer">
        <span class="previous">Previous: {{ previous | number }}</span>
        <span class="change" [class.positive]="change >= 0">
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      .progress-stat {
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
      }

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .value {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }
      }

      .progress-bar {
        width: 100%;
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4f8cff, #3171ff);
        transition: width 0.3s ease;
      }

      .stat-footer {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #94a3b8;

        .change {
          font-weight: 600;
          color: #ef4444;

          &.positive {
            color: #10b981;
          }
        }
      }
    `
  ]
})
export class ProgressStatComponent {
  @Input() label = '';
  @Input() current = 0;
  @Input() previous = 0;
  @Input() max = 100;
  @Input() unit = '';

  get percentage(): number {
    return (this.current / this.max) * 100;
  }

  get change(): number {
    if (this.previous === 0) return 0;
    return Math.round(((this.current - this.previous) / this.previous) * 100);
  }
}
