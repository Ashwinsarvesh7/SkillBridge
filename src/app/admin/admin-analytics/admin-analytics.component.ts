import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../services/admin.service';
import { AdminAnalytics } from '../../models';
import { BarChartComponent } from '../../shared/charts/bar-chart.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, BarChartComponent],
  template: `
    @if (loading) {
      <div class="loading"><mat-progress-spinner></mat-progress-spinner></div>
    }
    @if (!loading) {
      <div class="cards">
        <mat-card class="metric">
          <div class="label">Total Users</div>
          <div class="value">{{ analytics?.totalUsers }}</div>
          <div class="meta">Active: {{ analytics?.activeUsers }}</div>
        </mat-card>
        <mat-card class="metric">
          <div class="label">Exchanges</div>
          <div class="value">{{ analytics?.totalExchanges }}</div>
          <div class="meta">Completed: {{ analytics?.completedExchanges }}</div>
        </mat-card>
        <mat-card class="metric">
          <div class="label">Open Reports</div>
          <div class="value">{{ analytics?.openReports }}</div>
          <div class="meta">Pending: {{ analytics?.pendingExchanges }}</div>
        </mat-card>
        <mat-card class="metric">
          <div class="label">Total Skills</div>
          <div class="value">{{ analytics?.totalSkills }}</div>
          <div class="meta">&nbsp;</div>
        </mat-card>
      </div>

      <div class="charts">
        <mat-card class="chart-card">
          <div class="chart-header"><h4>Exchange Breakdown</h4>
            <div class="chart-actions"><button mat-icon-button (click)="export('csv')" matTooltip="Export CSV"><mat-icon>download</mat-icon></button>
            <button mat-icon-button (click)="export('pdf')" matTooltip="Export PDF"><mat-icon>picture_as_pdf</mat-icon></button></div>
          </div>
          <app-bar-chart [data]="exchangeChart"></app-bar-chart>
        </mat-card>

        <mat-card class="chart-card">
          <div class="chart-header"><h4>User Growth</h4></div>
          <app-bar-chart [data]="growthChart"></app-bar-chart>
        </mat-card>
      </div>
    }
  `,
  styles: [
    `.cards{display:flex;gap:12px;flex-wrap:wrap}.metric{flex:1 1 220px;padding:16px;border-radius:8px;background:#fff}.metric .label{color:#64748b}.metric .value{font-size:28px;font-weight:700;margin-top:6px}.metric .meta{color:#94a3b8;margin-top:6px}.charts{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}.chart-card{flex:1 1 560px;padding:12px}`,
    `.loading{display:flex;justify-content:center;padding:24px}`
  ]
})
export class AdminAnalyticsComponent implements OnInit {
  private adminService = inject(AdminService);
  analytics: AdminAnalytics | null = null;
  loading = true;

  exchangeChart: Array<{ label: string; value: number }> = [];
  growthChart: Array<{ label: string; value: number }> = [];

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.adminService.getAnalytics().subscribe(a => {
      this.analytics = a;
      this.buildCharts();
      this.loading = false;
    }, () => this.loading = false);
  }

  private buildCharts(): void {
    const a = this.analytics;
    if (!a) { this.exchangeChart = []; this.growthChart = []; return; }
    this.exchangeChart = [
      { label: 'Total', value: a.totalExchanges },
      { label: 'Completed', value: a.completedExchanges },
      { label: 'Pending', value: a.pendingExchanges }
    ];
    // simplistic growth sample for chart
    const months = ['Jan','Feb','Mar','Apr','May','Jun'];
    const base = a.totalUsers;
    this.growthChart = months.map((m, idx) => ({ label: m, value: Math.max(base - (months.length - idx - 1) * 7, 0) }));
  }

  export(format: 'csv' | 'pdf' = 'csv') {
    if (!this.analytics) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', String(this.analytics.totalUsers)],
      ['Active Users', String(this.analytics.activeUsers)],
      ['Total Exchanges', String(this.analytics.totalExchanges)],
      ['Completed Exchanges', String(this.analytics.completedExchanges)],
      ['Pending Exchanges', String(this.analytics.pendingExchanges)],
      ['Open Reports', String(this.analytics.openReports)],
      ['Total Skills', String(this.analytics.totalSkills)]
    ];

    if (format === 'csv') {
      const content = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([content], { type: 'text/csv' });
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `analytics-${new Date().toISOString().slice(0,10)}.csv`; link.click(); URL.revokeObjectURL(link.href);
      return;
    }

    // Printable PDF via new window (user can print to PDF)
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Analytics</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#0f172a} .card{border:1px solid #e6eefc;padding:12px;margin:8px;border-radius:6px}</style></head><body><h2>SkillBridge Analytics - ${new Date().toLocaleDateString()}</h2>` +
      rows.map(r => `<div class="card"><strong>${r[0]}:</strong> ${r[1]}</div>`).join('') +
      `</body></html>`;
    const win = window.open('', '_blank', 'noopener');
    if (!win) return; win.document.write(html); win.document.close(); win.focus();
    // let user print to PDF
  }
}
