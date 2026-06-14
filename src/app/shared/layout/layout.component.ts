import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private chat = inject(ChatService);

  navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/search', icon: 'search', label: 'Find Skills' },
    { path: '/requests', icon: 'swap_horiz', label: 'Exchanges' },
    { path: '/chat', icon: 'chat', label: 'Messages' }
  ];

  ngOnInit(): void {
    try {
      this.chat.connect();
    } catch {
      // WebSocket optional; login/dashboard should still work
    }
    if (this.auth.isAdmin()) {
      this.navItems.push({ path: '/admin', icon: 'admin_panel_settings', label: 'Admin' });
    }
  }

  logout(): void {
    this.chat.disconnect();
    this.auth.logout();
  }
}
