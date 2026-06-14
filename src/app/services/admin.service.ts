import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AdminAnalytics, AdminDashboard, Activity, ExchangeRequest, Report, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);
  getUsers() { return this.api.get<User[]>('/admin/users'); }
  getUser(id: number) { return this.api.get<User>(`/admin/users/${id}`); }
  disableUser(id: number, reason?: string) { return this.api.patch<void>(`/admin/users/${id}/disable`, { reason }); }
  enableUser(id: number) { return this.api.patch<void>(`/admin/users/${id}/enable`, {}); }
  deleteUser(id: number) { return this.api.delete<void>(`/admin/users/${id}`); }
  updateUser(id: number, userUpdate: Partial<User>) { return this.api.patch<User>(`/admin/users/${id}`, userUpdate); }
  getReports() { return this.api.get<Report[]>('/admin/reports'); }
  resolveReport(id: number) { return this.api.put<Report>(`/admin/reports/${id}/resolve`, {}); }
  dismissReport(id: number) { return this.api.put<Report>(`/admin/reports/${id}/dismiss`, {}); }
  disableReportedUser(reportId: number) { return this.api.put<Report>(`/admin/reports/${reportId}/disable-user`, {}); }
  getAnalytics() { return this.api.get<AdminAnalytics>('/admin/analytics'); }
  getLogs() { return this.api.get<Activity[]>('/admin/logs'); }
  getDashboard() { return this.api.get<AdminDashboard>('/admin/dashboard'); }
  getExchanges() { return this.api.get<ExchangeRequest[]>('/admin/exchanges'); }
}
