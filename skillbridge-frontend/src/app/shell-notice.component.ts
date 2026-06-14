import { Component } from '@angular/core';

@Component({
  selector: 'app-shell-notice',
  standalone: true,
  template: `
    <main class="notice">
      <h1>Wrong frontend folder</h1>
      <p>
        This <code>skillbridge-frontend</code> folder is an old Angular scaffold with no pages.
        Run the real SkillBridge UI from the <strong>project root</strong>.
      </p>
      <ol>
        <li>Stop this dev server (Ctrl+C).</li>
        <li>Open a terminal in <code>SkillBuilding-Platform</code> (parent folder).</li>
        <li>Run <code>npm start</code>.</li>
        <li>Open <a href="http://localhost:4200/auth/login">http://localhost:4200/auth/login</a></li>
      </ol>
    </main>
  `,
  styles: `
    .notice {
      max-width: 560px;
      margin: 48px auto;
      padding: 24px;
      font-family: 'Segoe UI', sans-serif;
      line-height: 1.5;
    }
    h1 { color: #3f51b5; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
  `
})
export class ShellNoticeComponent {}
