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

      max-width: 600px;

      margin: 32px auto;

      text-align: center;

      padding: 56px 32px;

      border-radius: 28px;

      background: var(--surface);

      border: 1px dashed var(--border);

      box-shadow:
        0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .empty-icon {

      font-size: 72px;

      margin-bottom: 24px;

      opacity: 0.9;
    }

    h3 {

      margin: 0 0 12px;

      font-size: 1.75rem;

      font-weight: 700;

      color: var(--text-primary);
    }

    p {

      max-width: 420px;

      margin: 0 auto 24px;

      color: var(--text-secondary);

      font-size: 1rem;

      line-height: 1.6;
    }

    :host-context(body.dark-theme) .empty-state {

      background: #1e293b;

      border-color: rgba(255,255,255,.08);

      box-shadow:
        0 20px 40px rgba(0,0,0,.35);
    }

    @media (max-width: 768px) {

      .empty-state {

        padding: 40px 24px;

        margin: 20px auto;
      }

      h3 {
        font-size: 1.4rem;
      }

      .empty-icon {
        font-size: 60px;
      }
    }
  `
]
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No data';
  @Input() message = 'Nothing to show here yet.';
}
