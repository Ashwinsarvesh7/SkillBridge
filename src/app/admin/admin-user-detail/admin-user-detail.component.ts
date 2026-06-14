import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User, ExchangeRequest, Report, Activity } from '../../models';
import { Observable, forkJoin } from 'rxjs';

interface DialogData { userId: number }

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatListModule, MatTabsModule, MatCardModule, MatChipsModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss']
})
export class AdminUserDetailComponent implements OnInit {
  private data = inject(MAT_DIALOG_DATA) as DialogData;
  private dialogRef = inject(MatDialogRef<AdminUserDetailComponent>);
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  user: User | null = null;
  exchanges: ExchangeRequest[] = [];
  reports: Report[] = [];
  logs: Activity[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    const user$ = this.adminService.getUser(this.data.userId);
    const exchanges$ = this.adminService.getExchanges();
    const reports$ = this.adminService.getReports();
    const logs$ = this.adminService.getLogs();

    forkJoin([user$, exchanges$, reports$, logs$]).subscribe(([u, ex, rp, lg]) => {
      this.user = u;
      this.exchanges = ex.filter(e => e.senderId === u.id || e.receiverId === u.id);
      this.reports = rp.filter(r => r.reportedUserId === u.id || r.reporterId === u.id);
      this.logs = lg.filter(l => JSON.stringify(l).includes(String(u.id)) || (u.email && JSON.stringify(l).includes(u.email)));
      this.loading = false;
    }, () => this.loading = false);
  }

  close(): void { this.dialogRef.close(); }

  blockUser(): void {
    if (!this.user) return;
    if (this.user.role === 'ADMIN') {
      this.snackBar.open('Admin users cannot be blocked.', 'Close', { duration: 3000 });
      return;
    }
    this.adminService.disableUser(this.user.id, 'Blocked by admin').subscribe(() => {
      this.snackBar.open('User blocked', 'Close', { duration: 2000 });
      this.loadAll();
    });
  }

  unblockUser(): void {
    if (!this.user) return;
    this.adminService.enableUser(this.user.id).subscribe(() => {
      this.snackBar.open('User unblocked', 'Close', { duration: 2000 });
      this.loadAll();
    });
  }

  deleteUser(): void {
    if (!this.user || !confirm('Delete user permanently?')) return;
    if (this.user.role === 'ADMIN') {
      this.snackBar.open('Admin users cannot be deleted.', 'Close', { duration: 3000 });
      return;
    }
    this.adminService.deleteUser(this.user.id).subscribe(() => {
      this.snackBar.open('User deleted', 'Close', { duration: 2000 });
      this.dialogRef.close({ deleted: true });
    }, error => {
      console.error('Delete user failed', error);
      this.snackBar.open(error?.message || 'Failed to delete user', 'Close', { duration: 4000 });
    });
  }
}
