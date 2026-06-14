import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shell-notice.component').then(m => m.ShellNoticeComponent)
  },
  { path: '**', redirectTo: '' }
];
