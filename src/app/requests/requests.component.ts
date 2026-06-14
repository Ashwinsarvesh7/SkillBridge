import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExchangeService } from '../services/exchange.service';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { ExchangeRequest } from '../models';
import { EmptyStateComponent } from '../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    EmptyStateComponent
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent implements OnInit {
  private exchangeService = inject(ExchangeService);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  allRequests = signal<ExchangeRequest[]>([]);
  reviewTarget = signal<ExchangeRequest | null>(null);

  pending = computed(() => this.allRequests().filter(r => r.status === 'PENDING'));
  active = computed(() => this.allRequests().filter(r => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status)));
  history = computed(() => this.allRequests().filter(r => ['REJECTED', 'CANCELLED', 'COMPLETED'].includes(r.status)));

  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.exchangeService.getAll().subscribe(r => this.allRequests.set(r));
  }

  isReceiver(req: ExchangeRequest): boolean {
    return req.receiverId === this.auth.currentUser()?.id;
  }

  respond(id: number, status: 'ACCEPTED' | 'REJECTED'): void {
    this.exchangeService.respond(id, status).subscribe((request) => {
      if (status === 'ACCEPTED' && request.sessionRoom) {
        this.router.navigate(['/session'], {
          queryParams: { contact: request.senderId, room: request.sessionRoom }
        });
      } else {
        this.load();
      }
    });
  }

  joinSession(req: ExchangeRequest): void {
    const contactId = req.senderId === this.auth.currentUser()?.id ? req.receiverId : req.senderId;
    if (!req.sessionRoom) return;
    this.router.navigate(['/session'], {
      queryParams: { contact: contactId, room: req.sessionRoom }
    });
  }

  complete(id: number): void {
    this.exchangeService.complete(id).subscribe(() => this.load());
  }

  cancel(id: number): void {
    this.exchangeService.cancel(id).subscribe(() => this.load());
  }

  openChat(req: ExchangeRequest): void {
    const contactId = req.senderId === this.auth.currentUser()?.id ? req.receiverId : req.senderId;
    const queryParams: Record<string, string | number> = { contact: contactId };
    if (req.sessionRoom) {
      queryParams['room'] = req.sessionRoom;
    }
    this.router.navigate(['/chat'], { queryParams });
  }

  openReview(req: ExchangeRequest): void {
    this.reviewTarget.set(req);
  }

  closeReview(): void {
    this.reviewTarget.set(null);
  }

  submitReview(): void {
    const target = this.reviewTarget();
    if (!target || this.reviewForm.invalid) return;
    const reviewedUserId = target.senderId === this.auth.currentUser()?.id
      ? target.receiverId : target.senderId;
    this.reviewService.create({
      exchangeRequestId: target.id,
      reviewedUserId,
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment || undefined
    }).subscribe({
      next: () => {
        this.closeReview();
        this.load();
      },
      error: (e) => alert(e.message)
    });
  }

  getRating(): number {
    return this.reviewForm.get('rating')?.value ?? 0;
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'warn', ACCEPTED: 'primary', IN_PROGRESS: 'accent',
      COMPLETED: 'primary', REJECTED: '', CANCELLED: ''
    };
    return map[status] || '';
  }
}
