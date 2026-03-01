import api from './api';
import type { JobPost, CreateJobPostData } from '@/types/jobPost';

// Helper pour mapper les données MongoDB vers le format frontend
const mapJobPost = (jobPost: any): JobPost => {
  if (!jobPost) {
    console.error('❌ mapJobPost: jobPost is undefined or null');
    throw new Error('JobPost data is missing from API response');
  }
  
  return {
    ...jobPost,
    id: jobPost._id || jobPost.id,
  };
};

interface JobPostsResponse {
  success: boolean;
  data: {
    jobPosts: JobPost[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface JobPostResponse {
  success: boolean;
  data: any; // Flexible pour gérer data.jobPost ou data directement
  jobPost?: JobPost; // Pour les réponses avec jobPost à la racine
}

interface JobPostStatsResponse {
  success: boolean;
  data: {
    totalCandidates: number;
    newCandidates: number;
    reviewedCandidates: number;
    shortlistedCandidates: number;
    rejectedCandidates: number;
    averageScore: number;
    topScore: number;
    viewCount: number;
  };
}

class JobPostsService {
  /**
   * Créer une nouvelle offre d'emploi
   */
  async createJobPost(data: CreateJobPostData): Promise<JobPost> {
    const response = await api.post<JobPostResponse>('/job-posts', data);
    console.log('📡 Réponse createJobPost:', response);
    console.log('📡 response.data:', response.data);
    console.log('📡 response.data.data:', response.data.data);
    console.log('📡 response.data.data.jobPost:', response.data.data?.jobPost);
    
    // Essayer différentes structures de réponse
    if (response.data.data?.jobPost) {
      return mapJobPost(response.data.data.jobPost);
    } else if (response.data.jobPost) {
      return mapJobPost(response.data.jobPost);
    } else if (response.data.data) {
      return mapJobPost(response.data.data);
    } else {
      console.error('❌ Structure de réponse API invalide');
      throw new Error('Structure de réponse API invalide pour createJobPost');
    }
  }

  /**
   * Lister les offres d'emploi du partenaire
   */
  async getJobPosts(params?: {
    status?: 'draft' | 'active' | 'closed' | 'archived';
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<JobPostsResponse['data']> {
    const response = await api.get<JobPostsResponse>('/job-posts', { params });
    return {
      ...response.data.data,
      jobPosts: (response.data.data.jobPosts || []).filter(Boolean).map(mapJobPost),
    };
  }

  /**
   * Récupérer une offre d'emploi par ID
   */
  async getJobPost(id: string): Promise<JobPost> {
    const response = await api.get<JobPostResponse>(`/job-posts/${id}`);
    return mapJobPost(response.data.data.jobPost);
  }

  /**
   * Mettre à jour une offre d'emploi
   */
  async updateJobPost(id: string, data: Partial<CreateJobPostData>): Promise<JobPost> {
    const response = await api.put<JobPostResponse>(`/job-posts/${id}`, data);
    return mapJobPost(response.data.data.jobPost);
  }

  /**
   * Publier une offre d'emploi
   */
  async publishJobPost(id: string): Promise<JobPost> {
    const response = await api.post<JobPostResponse>(`/job-posts/${id}/publish`);
    console.log('📡 publishJobPost API response:', response.data);
    console.log('📦 publishJobPost data.jobPost:', response.data.data?.jobPost);
    
    // Essayer différentes structures de réponse
    if (response.data.data?.jobPost) {
      return mapJobPost(response.data.data.jobPost);
    } else if (response.data.data) {
      return mapJobPost(response.data.data);
    } else {
      console.error('❌ Structure de réponse API invalide pour publishJobPost');
      throw new Error('Structure de réponse API invalide pour publishJobPost');
    }
  }

  /**
   * Fermer une offre d'emploi
   */
  async closeJobPost(id: string): Promise<JobPost> {
    const response = await api.post<JobPostResponse>(`/job-posts/${id}/close`);
    
    // Essayer différentes structures de réponse
    if (response.data.data?.jobPost) {
      return mapJobPost(response.data.data.jobPost);
    } else if (response.data.data) {
      return mapJobPost(response.data.data);
    } else {
      console.error('❌ Structure de réponse API invalide pour closeJobPost');
      throw new Error('Structure de réponse API invalide pour closeJobPost');
    }
  }

  /**
   * Dupliquer une offre d'emploi
   */
  async duplicateJobPost(id: string): Promise<JobPost> {
    const response = await api.post<JobPostResponse>(`/job-posts/${id}/duplicate`);
    return mapJobPost(response.data.data.jobPost);
  }

  /**
   * Supprimer une offre d'emploi
   */
  async deleteJobPost(id: string): Promise<void> {
    await api.delete(`/job-posts/${id}`);
  }

  /**
   * Récupérer les statistiques d'une offre
   */
  async getJobPostStats(id: string): Promise<JobPostStatsResponse['data']> {
    const response = await api.get<JobPostStatsResponse>(`/job-posts/${id}/stats`);
    return response.data.data;
  }
}

export const jobPostsService = new JobPostsService();
