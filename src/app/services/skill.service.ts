import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Skill } from '../models';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private api = inject(ApiService);
  getAll() { return this.api.get<Skill[]>('/skills'); }
  search(q: string) { return this.api.get<Skill[]>('/skills/search', { q }); }
  getCategories() { return this.api.get<string[]>('/skills/categories'); }
}
