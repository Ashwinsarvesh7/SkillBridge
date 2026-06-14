import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <svg class="bar-chart" [attr.viewBox]="'0 0 ' + width + ' ' + height">
      <!-- Grid lines -->
      <line *ngFor="let i of [0, 1, 2, 3, 4, 5]"
        [attr.x1]="60" [attr.y1]="i * (height - 40) / 5 + 20"
        [attr.x2]="width - 20" [attr.y2]="i * (height - 40) / 5 + 20"
        stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2" />

      <!-- Bars -->
      <g *ngFor="let item of data; let idx = index">
        <rect [attr.x]="60 + idx * barWidth + 10"
          [attr.y]="height - 40 - (item.value / maxValue) * (height - 60)"
          [attr.width]="barWidth - 20"
          [attr.height]="(item.value / maxValue) * (height - 60)"
          fill="url(#gradient)" rx="4" />
        <text [attr.x]="60 + idx * barWidth + barWidth / 2"
          [attr.y]="height - 20"
          text-anchor="middle"
          font-size="11"
          fill="#64748b">
          {{ item.label }}
        </text>
        <text [attr.x]="60 + idx * barWidth + barWidth / 2"
          [attr.y]="height - 45 - (item.value / maxValue) * (height - 60)"
          text-anchor="middle"
          font-size="12"
          font-weight="bold"
          fill="#0f172a">
          {{ item.value }}
        </text>
      </g>

      <!-- Axes -->
      <line x1="60" [attr.y1]="height - 40" [attr.x2]="width - 20" [attr.y2]="height - 40" stroke="#0f172a" stroke-width="2" />
      <line x1="60" y1="20" x2="60" [attr.y2]="height - 40" stroke="#0f172a" stroke-width="2" />

      <!-- Gradient -->
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: #4f8cff; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #3171ff; stop-opacity: 1" />
        </linearGradient>
      </defs>
    </svg>
  `,
  styles: [
    `
      .bar-chart {
        width: 100%;
        height: 300px;
      }
    `
  ]
})
export class BarChartComponent {
  @Input() data: Array<{ label: string; value: number }> = [];
  @Input() width = 600;
  @Input() height = 320;

  get barWidth(): number {
    return (this.width - 80) / Math.max(this.data.length, 1);
  }

  get maxValue(): number {
    return Math.max(...this.data.map(d => d.value), 1);
  }
}
