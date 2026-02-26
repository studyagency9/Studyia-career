import api from './api';

interface DashboardData {
  totalJobPosts: number;
  activeJobPosts: number;
  totalApplications: number;
  newApplications: number;
  shortlistedCandidates: number;
  averageScore: number;
  topPerformingJobs: {
    _id: string;
    title: string;
    applicationCount: number;
    averageScore: number;
  }[];
  applicationTrend: {
    date: string;
    count: number;
  }[];
}

interface SkillsAnalytics {
  topSkills: {
    skill: string;
    count: number;
    averageScore: number;
  }[];
  skillsGap: {
    skill: string;
    demandCount: number;
    supplyCount: number;
    gap: number;
  }[];
}

interface CandidatesAnalytics {
  totalCandidates: number;
  byStatus: {
    status: string;
    count: number;
  }[];
  byScore: {
    range: string;
    count: number;
  }[];
  topCities: {
    city: string;
    count: number;
  }[];
  experienceDistribution: {
    level: string;
    count: number;
  }[];
}

interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
}

class AnalyticsService {
  /**
   * Get dashboard analytics
   */
  async getDashboard(period: 'week' | 'month' | 'year' = 'month'): Promise<DashboardData> {
    const response = await api.get<AnalyticsResponse<DashboardData>>(
      '/analytics/dashboard',
      { params: { period } }
    );

    return response.data.data;
  }

  /**
   * Get skills analytics
   */
  async getSkillsAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<SkillsAnalytics> {
    const response = await api.get<AnalyticsResponse<SkillsAnalytics>>(
      '/analytics/skills',
      { params: { period } }
    );

    return response.data.data;
  }

  /**
   * Get candidates analytics
   */
  async getCandidatesAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<CandidatesAnalytics> {
    const response = await api.get<AnalyticsResponse<CandidatesAnalytics>>(
      '/analytics/candidates',
      { params: { period } }
    );

    return response.data.data;
  }
}

export const analyticsService = new AnalyticsService();
