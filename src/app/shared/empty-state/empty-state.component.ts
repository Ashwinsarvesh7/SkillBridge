import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="empty-state">
      <div class="empty-icon">{{ icon }}</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <ng-content></ng-content>
    </mat-card>
  `,
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 48px 24px;
        border-radius: 12px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border: 1px dashed #cbd5e1;
      }

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.6;
      }

      h3 {
        margin: 12px 0 8px;
        color: #0f172a;
        font-size: 16px;
      }

      p {
        color: #64748b;
        font-size: 14px;
        margin: 0 0 16px;
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No data';
  @Input() message = 'Nothing to show here yet.';
}
