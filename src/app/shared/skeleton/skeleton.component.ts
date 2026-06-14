import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngClass]="['skeleton', variant, size]" [style.width]="width"></div>`,
  styles: [
    `
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 6px;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      .skeleton.text { height: 14px; margin: 8px 0; }
      .skeleton.line { height: 16px; margin: 4px 0; }
      .skeleton.heading { height: 24px; margin: 12px 0; }
      .skeleton.card { height: 120px; margin: 12px 0; }
      .skeleton.avatar { width: 40px; height: 40px; border-radius: 50%; }

      .skeleton.small { max-width: 60%; }
      .skeleton.medium { max-width: 80%; }
      .skeleton.large { width: 100%; }
    `
  ]
})
export class SkeletonComponent {
  @Input() variant: 'text' | 'line' | 'heading' | 'card' | 'avatar' = 'text';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() width?: string;
}
