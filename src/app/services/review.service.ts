import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Review } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = inject(ApiService);
  create(data: { exchangeRequestId: number; reviewedUserId: number; rating: number; comment?: string }) {
    return this.api.post<Review>('/reviews', data);
  }
  getForUser(userId: number) { return this.api.get<Review[]>(`/reviews/user/${userId}`); }
}
