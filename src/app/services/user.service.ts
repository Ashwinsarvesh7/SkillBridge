import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ExperienceLevel, User, UserSkill } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getProfile() { return this.api.get<User>('/users/me'); }
  getUser(id: number) { return this.api.get<User>(`/users/${id}`); }
  updateProfile(data: Partial<User>) { return this.api.put<User>('/users/me', data); }
  uploadPhoto(file: File) { return this.api.upload<User>('/users/me/photo', file); }
  addSkill(skillId: number, skillType: string, experienceLevel?: ExperienceLevel) {
    return this.api.post<UserSkill>('/users/me/skills', { skillId, skillType, experienceLevel });
  }
  removeSkill(id: number) { return this.api.delete<void>(`/users/me/skills/${id}`); }
  search(skill?: string, category?: string, experienceLevel?: ExperienceLevel) {
    return this.api.get<User[]>('/users/search', { skill: skill || '', category: category || '', experienceLevel: experienceLevel || '' });
  }
  getMatches() { return this.api.get<User[]>('/users/matches'); }
}
