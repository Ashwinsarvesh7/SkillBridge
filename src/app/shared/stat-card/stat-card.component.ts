import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl:'./stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() icon = 'trending_up';
  @Input() label = 'Metric';
  @Input() value: string | number = '0';
  @Input() footer: string | null = null;
  @Input() iconColor = 'primary';
  @Input() noPadding = false;
}
