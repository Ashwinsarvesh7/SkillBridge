import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'sb_dark_mode';
  isDarkMode = signal(localStorage.getItem(this.KEY) === 'true');

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      document.body.classList.toggle('dark-theme', dark);
      localStorage.setItem(this.KEY, String(dark));
    });
  }

  toggle(): void {
    this.isDarkMode.update(v => !v);
  }
}
