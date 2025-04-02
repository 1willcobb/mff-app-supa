import { User } from './index';

export interface Notification {
  id: string;
  userId: string;
  content: string;
  link?: string;
  createdAt: string;
  isRead: boolean;
  
  // Relations (optional for response objects that include relations)
  user?: User;
}

export interface CreateNotificationRequest {
  userId: string;
  content: string;
  link?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  page?: number;
  pageSize?: number;
}