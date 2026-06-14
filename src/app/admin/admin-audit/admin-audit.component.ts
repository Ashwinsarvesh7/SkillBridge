import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AdminService } from '../../services/admin.service';
import { Activity } from '../../models';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, MatPaginatorModule],
  template: `
    <div class="toolbar">
      <mat-form-field appearance="outline"><mat-label>Search logs</mat-label><input matInput [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Action, description, admin" /></mat-form-field>
      <div class="spacer"></div>
      <button mat-stroked-button (click)="exportCsv()"><mat-icon>download</mat-icon> Export CSV</button>
    </div>

    @if (loading) {
      <div class="loading"><mat-progress-spinner></mat-progress-spinner></div>
    }
    @if (!loading) {
      <table mat-table [dataSource]="paginated" class="full-width">
        <ng-container matColumnDef="action"><th mat-header-cell>Action</th><td mat-cell *matCellDef="let l">{{ l.activityType }}</td></ng-container>
        <ng-container matColumnDef="description"><th mat-header-cell>Description</th><td mat-cell *matCellDef="let l">{{ l.description }}</td></ng-container>
        <ng-container matColumnDef="time"><th mat-header-cell>Timestamp</th><td mat-cell *matCellDef="let l">{{ l.createdAt | date:'short' }}</td></ng-container>
        <tr mat-header-row *matHeaderRowDef="['action','description','time']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['action','description','time']"></tr>
      </table>

      <mat-paginator [length]="filtered.length" [pageSize]="pageSize" [pageSizeOptions]="[10,25,50]" (page)="onPageChange($event)"></mat-paginator>
    }
  `
})
export class AdminAuditComponent implements OnInit {
  private adminService = inject(AdminService);
  logs: Activity[] = [];
  filtered: Activity[] = [];
  loading = true;
  search = '';

  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.adminService.getLogs().subscribe(l => { this.logs = l.reverse(); this.applyFilters(); this.loading = false; }, () => this.loading = false);
  }

  applyFilters(): void {
    const term = this.search.toLowerCase().trim();
    this.filtered = this.logs.filter(l => !term || JSON.stringify(l).toLowerCase().includes(term));
    this.pageIndex = 0;
  }

  get paginated(): Activity[] {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  exportCsv(): void {
    const rows = [['Action','Description','Timestamp']];
    this.filtered.forEach(r => rows.push([r.activityType || '', r.description || '', r.createdAt || '']));
    const content = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `audit-logs-${new Date().toISOString().slice(0,10)}.csv`; link.click(); URL.revokeObjectURL(link.href);
  }
}
