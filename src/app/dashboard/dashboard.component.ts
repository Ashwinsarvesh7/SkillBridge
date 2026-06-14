import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { Dashboard } from '../models';
import { SkeletonComponent } from '../shared/skeleton/skeleton.component';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { EmptyStateComponent } from '../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    SkeletonComponent,
    StatCardComponent,
    EmptyStateComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  auth = inject(AuthService);
  data = signal<Dashboard | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: d => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard load error:', err);
        this.error.set(err?.message || 'Failed to load dashboard');
        this.loading.set(false);
      }
    });
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'warn',
      ACCEPTED: 'primary',
      IN_PROGRESS: 'accent',
      COMPLETED: 'primary'
    };
    return map[status] || '';
  }
}
