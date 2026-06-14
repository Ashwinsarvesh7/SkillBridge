import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  users: User[] = [];
  filtered: User[] = [];
  loading = true;
  search = '';
  roleFilter: 'ALL' | 'USER' | 'ADMIN' = 'ALL';
  statusFilter: 'ALL' | 'ACTIVE' | 'DISABLED' = 'ALL';

  // Paginationn
  pageIndex = 0;
  pageSize = 10;

  displayedColumns = ['profile', 'name', 'email', 'phone', 'accountId', 'status', 'skillsKnown', 'skillsWanted', 'sessions', 'lastLogin', 'reports', 'actions'];

  // Selection / detail
  selectedUser: User | null = null;
  editing = false;
  draft: Partial<User> | null = null;
  activity: any[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe(u => {
      this.users = u;
      this.applyFilters();
      this.loading = false;
    }, () => this.loading = false);
  }

  applyFilters(): void {
    const term = this.search.toLowerCase().trim();
    this.filtered = this.users.filter(u => {
      const matchesSearch = !term || `${u.firstName} ${u.lastName} ${u.email || ''}`.toLowerCase().includes(term);
      const matchesRole = this.roleFilter === 'ALL' || u.role === this.roleFilter;
      const status = u.enabled ? 'ACTIVE' : 'DISABLED';
      const matchesStatus = this.statusFilter === 'ALL' || status === this.statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
    // reset pagination when filters change
    this.pageIndex = 0;
  }

  // computed paginated results
  get paginated(): User[] {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  enableUser(user: User): void {
    this.adminService.enableUser(user.id).subscribe(() => {
      this.snackBar.open('User enabled', 'Close', { duration: 2000 });
      this.loadUsers();
    });
  }

  disableUser(user: User): void {
    if (user.role === 'ADMIN') {
      this.snackBar.open('Admin users cannot be blocked.', 'Close', { duration: 3000 });
      return;
    }
    this.adminService.disableUser(user.id, 'Disabled by admin').subscribe(() => {
      this.snackBar.open('User disabled', 'Close', { duration: 2000 });
      this.loadUsers();
    });
  }

  deleteUser(user: User): void {
    if (user.role === 'ADMIN') {
      this.snackBar.open('Admin users cannot be deleted.', 'Close', { duration: 3000 });
      return;
    }
    if (!confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;
    this.adminService.deleteUser(user.id).subscribe(() => {
      this.snackBar.open('User deleted', 'Close', { duration: 2000 });
      this.loadUsers();
    }, error => {
      console.error('Delete user failed', error);
      this.snackBar.open(error?.message || 'Failed to delete user', 'Close', { duration: 4000 });
    });
  }

  // Detail / actions
  viewUser(user: User): void {
    // open detail dialog
    import('../admin-user-detail/admin-user-detail.component').then(m => {
      const dialogRef = this.dialog.open(m.AdminUserDetailComponent, { data: { userId: user.id } });
      dialogRef.afterClosed().subscribe(result => {
        if (result?.deleted) {
          this.loadUsers();
        }
      });
    });
  }

  editUser(): void {
    this.editing = true;
  }

  cancelEdit(): void {
    if (this.selectedUser) this.draft = { ...this.selectedUser };
    this.editing = false;
  }

  saveUser(): void {
    if (!this.draft || !this.selectedUser) return;
    this.adminService.updateUser(this.selectedUser.id, this.draft as Partial<User>).subscribe(u => {
      this.snackBar.open('User updated', 'Close', { duration: 2000 });
      this.selectedUser = u;
      this.draft = { ...u };
      this.editing = false;
      this.loadUsers();
    });
  }

  loadActivity(user: User): void {
    this.activity = [];
    this.adminService.getLogs().subscribe(logs => {
      // naive filter: include logs that mention user's id or email or name
      const key = String(user.id);
      this.activity = logs.filter(l => JSON.stringify(l).includes(key) || (user.email && JSON.stringify(l).includes(user.email)) || JSON.stringify(l).includes(user.firstName) || JSON.stringify(l).includes(user.lastName));
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
