export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type UserRole = 'USER' | 'ADMIN';
export type SkillType = 'TEACH' | 'LEARN';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type NotificationType = 'REQUEST' | 'ACCEPTANCE' | 'REJECTION' | 'COMPLETION' | 'REVIEW' | 'SYSTEM' | 'CHAT';
export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  accountId?: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhotoUrl?: string;
  experienceLevel: ExperienceLevel;
  role: UserRole;
  profileCompletionPercent: number;
  enabled?: boolean;
  disabledBy?: string;
  disabledDate?: string;
  disabledReason?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  averageRating?: number;
  totalReviews?: number;
  skills?: UserSkill[];
  matchScore?: number;
}

export interface UserSkill {
  id: number;
  skillId: number;
  skillName: string;
  category: string;
  skillType: SkillType;
  experienceLevel: ExperienceLevel;
  badgeLevel: string;
  completedExchanges: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export interface ExchangeRequest {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  offeredSkillId: number;
  offeredSkillName: string;
  requestedSkillId: number;
  requestedSkillName: string;
  status: RequestStatus;
  message?: string;
  sessionRoom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewedUserId: number;
  exchangeRequestId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  exchangeRequestId?: number;
  content: string;
  read: boolean;
  sentAt: string;
}

export interface Dashboard {
  recommendedUsers: User[];
  activeExchanges: ExchangeRequest[];
  notifications: Notification[];
  recentActivity: Activity[];
  stats: UserStats;
  unreadNotifications: number;
  unreadMessages: number;
}

export interface Activity {
  id: number;
  activityType: string;
  description: string;
  createdAt: string;
}

export interface UserStats {
  totalExchanges: number;
  completedExchanges: number;
  pendingRequests: number;
  skillsTeaching: number;
  skillsLearning: number;
  profileCompletionPercent: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalExchanges: number;
  completedExchanges: number;
  pendingExchanges: number;
  openReports: number;
  totalSkills: number;
}

export interface AdminDashboard {
  analytics: AdminAnalytics;
  openReports: Report[];
  auditLogs: Activity[];
}

export interface Report {
  id: number;
  reporterId: number;
  reporterName: string;
  reportedUserId: number;
  reportedUserName: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}
