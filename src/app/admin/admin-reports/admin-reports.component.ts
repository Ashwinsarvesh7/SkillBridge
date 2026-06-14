import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../services/admin.service';
import { Report } from '../../models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  reports: Report[] = [];
  filtered: Report[] = [];
  loading = true;
  search = '';
  statusFilter: string = 'ALL';

  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.adminService.getReports().subscribe(r => { this.reports = r; this.applyFilters(); this.loading = false; }, () => this.loading = false);
  }

  applyFilters(): void {
    const term = this.search.toLowerCase().trim();
    this.filtered = this.reports.filter(r => {
      const matchesSearch = !term || `${r.reporterName} ${r.reportedUserName} ${r.reason}`.toLowerCase().includes(term);
      const matchesStatus = this.statusFilter === 'ALL' || r.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
    this.pageIndex = 0;
  }

  get paginated(): Report[] {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onPageChange(e: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  resolve(report: Report): void {
    this.adminService.resolveReport(report.id).subscribe(() => { this.snackBar.open('Report resolved', 'Close', { duration: 2000 }); this.loadReports(); });
  }

  dismiss(report: Report): void {
    this.adminService.dismissReport(report.id).subscribe(() => { this.snackBar.open('Report dismissed', 'Close', { duration: 2000 }); this.loadReports(); });
  }

  suspendReportedUser(report: Report): void {
    this.adminService.disableReportedUser(report.id).subscribe(() => { this.snackBar.open('Reported user disabled', 'Close', { duration: 2000 }); this.loadReports(); });
  }

  viewUser(userId: number): void {
    import('../admin-user-detail/admin-user-detail.component').then(m => {
      this.dialog.open(m.AdminUserDetailComponent, { data: { userId } });
    });
  }
}
