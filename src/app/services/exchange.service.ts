import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ExchangeRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private api = inject(ApiService);

  getAll() { return this.api.get<ExchangeRequest[]>('/exchanges'); }
  getActive() { return this.api.get<ExchangeRequest[]>('/exchanges/active'); }
  create(data: { receiverId: number; offeredSkillId: number; requestedSkillId: number; message?: string }) {
    return this.api.post<ExchangeRequest>('/exchanges', data);
  }
  respond(id: number, status: 'ACCEPTED' | 'REJECTED') {
    return this.api.patch<ExchangeRequest>(`/exchanges/${id}/respond`, { status });
  }
  complete(id: number) { return this.api.patch<ExchangeRequest>(`/exchanges/${id}/complete`, {}); }
  cancel(id: number) { return this.api.patch<ExchangeRequest>(`/exchanges/${id}/cancel`, {}); }
}
