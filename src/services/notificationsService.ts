import api from './api';

export interface Notification {
  _id: string;
  partnerId: string;
  type: 'new_application' | 'high_score_candidate' | 'deadline_reminder' | 'job_published' | 'job_closed';
  title: string;
  message: string;
  data?: {
    jobPostId?: string;
    candidateId?: string;
    score?: number;
  };
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    unreadCount: number;
  };
}

interface NotificationResponse {
  success: boolean;
  data: {
    notification: Notification;
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  newApplications: boolean;
  highScoreCandidates: boolean;
  deadlineReminders: boolean;
}

interface NotificationSettingsResponse {
  success: boolean;
  data: NotificationSettings;
}

class NotificationsService {
  /**
   * Get notifications list
   */
  async getNotifications(params?: {
    read?: boolean;
    page?: number;
    limit?: number;
  }): Promise<NotificationsResponse['data']> {
    const response = await api.get<NotificationsResponse>('/notifications', { params });
    return response.data.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put<NotificationResponse>(`/notifications/${id}/read`);
    return response.data.data.notification;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  }

  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings> {
    const response = await api.get<NotificationSettingsResponse>('/notifications/settings');
    return response.data.data;
  }

  /**
   * Update notification settings
   */
  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await api.put<NotificationSettingsResponse>('/notifications/settings', settings);
    return response.data.data;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }
}

export const notificationsService = new NotificationsService();
