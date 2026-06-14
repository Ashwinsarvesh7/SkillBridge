import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models';

@Component({
  selector: 'app-admin-blocked',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <h3>Blocked Users</h3>
      @for (u of users; track u.id) {
        <div class="blocked-row">
          <div>{{ u.firstName }} {{ u.lastName }} ({{ u.email }})</div>
          <div><button mat-button (click)="enable(u)">Unblock</button></div>
        </div>
      }
    </mat-card>
  `,
  styles: [`.blocked-row{display:flex;justify-content:space-between;padding:8px 0}`]
})
export class AdminBlockedComponent implements OnInit {
  private adminService = inject(AdminService);
  users: User[] = [];

  ngOnInit(): void { this.load(); }
  load(): void { this.adminService.getUsers().subscribe(u => { this.users = u.filter(x => !x.enabled); }); }
  enable(user: User): void { this.adminService.enableUser(user.id).subscribe(() => this.load()); }
}
