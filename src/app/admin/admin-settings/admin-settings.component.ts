import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h3>Settings</h3>
      <p>Admin settings and feature flags will be managed here.</p>
    </mat-card>
  `
})
export class AdminSettingsComponent {}
