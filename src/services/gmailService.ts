import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface GmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId: string;
}

export interface GmailEmail {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  attachments: GmailAttachment[];
  hasAttachments: boolean;
}

class GmailService {
  async getAuthUrl(): Promise<string> {
    const response = await api.get('/gmail/auth-url');
    return response.data.data.authUrl;
  }

  async getStatus(): Promise<{ connected: boolean; email: string | null }> {
    try {
      const response = await api.get('/gmail/status');
      return response.data.data;
    } catch (error) {
      return { connected: false, email: null };
    }
  }

  async getEmails(params?: {
    maxResults?: number;
    query?: string;
    pageToken?: string;
  }): Promise<{ emails: GmailEmail[]; nextPageToken?: string }> {
    const response = await api.get('/gmail/emails', { params });
    return response.data.data;
  }

  async importToJobPost(
    jobPostId: string,
    attachments: Array<{
      messageId: string;
      attachmentId: string;
      filename: string;
      senderEmail: string;
    }>
  ): Promise<{ imported: number; failed: number; results?: any[] }> {
    const response = await api.post('/gmail/import-to-job', {
      jobPostId,
      attachments,
    });
    return response.data.data;
  }

  async disconnect(): Promise<void> {
    await api.delete('/gmail/disconnect');
  }

  openAuthWindow(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const authUrl = await this.getAuthUrl();
        
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const authWindow = window.open(
          authUrl,
          'Gmail Authorization',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!authWindow) {
          resolve(false);
          return;
        }

        let checkCount = 0;
        const maxChecks = 240;

        const checkClosed = setInterval(() => {
          checkCount++;
          
          try {
            if (authWindow.closed) {
              clearInterval(checkClosed);
              resolve(true);
            }
          } catch (e) {
            // Ignore COOP errors
          }

          if (checkCount >= maxChecks) {
            clearInterval(checkClosed);
            resolve(true);
          }
        }, 500);
      } catch (error) {
        console.error('Erreur ouverture fenêtre auth:', error);
        resolve(false);
      }
    });
  }
}

export const gmailService = new GmailService();
