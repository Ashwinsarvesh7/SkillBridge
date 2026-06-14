import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal('');
  private returnUrl: string | null = null;

  form = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
    password: ['', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'change' }]
  });

  constructor() {
    const params = this.route.snapshot.queryParams;
    this.returnUrl = params['returnUrl'] || null;
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.error.set('Enter a valid email and password (min 6 characters).');
      return;
    }
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (e: Error) => {
        this.error.set(e.message || 'Login failed');
      }
    });
  }
}
