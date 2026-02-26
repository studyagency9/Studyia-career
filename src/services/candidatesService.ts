import api from './api';

export interface Candidate {
  _id: string;
  jobPostId: string;
  partnerId: string;
  originalFileName: string;
  originalFileUrl: string;
  fileType: string;
  fileSize: number;
  pipelineStage: string;
  isFavorite: boolean;
  isViewed: boolean;
  cvData: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
      country?: string | null;
      address?: string;
      dateOfBirth?: string | null;
      gender?: string | null;
      nationality?: string | null;
      maritalStatus?: string | null;
      drivingLicense?: string | null;
    };
    professionalSummary?: string;
    experiences: {
      _id?: string;
      position: string;
      company: string;
      location?: string;
      startDate: string;
      endDate?: string | null;
      current: boolean;
      description?: string;
      responsibilities?: string;
    }[];
    education: {
      _id?: string;
      institution: string;
      degree: string;
      field?: string | null;
      startDate: string;
      endDate?: string | null;
      current: boolean;
      description?: string | null;
    }[];
    skills: Array<string | {
      _id?: string;
      name: string;
      level?: string;
      category?: string;
    }>;
    languages?: {
      _id?: string;
      name: string;
      level: string;
    }[];
    certifications?: any[];
    projects?: any[];
  };
  matchingAnalysis?: {
    globalScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    languageMatch?: boolean;
    locationMatch?: boolean;
    educationLevel?: string;
    yearsOfExperience?: number;
    analyzedAt?: string;
    matchedSkills: string[];
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    recommendation?: string;
  };
  status: 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'offer' | 'hired' | 'rejected';
  statusHistory?: any[];
  notes?: string[];
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  __v?: number;
}

interface UploadCVsResponse {
  success: boolean;
  data: {
    uploadedFiles: {
      filename: string;
      originalName: string;
      size: number;
      url: string;
      candidateId: string;
    }[];
    totalUploaded: number;
  };
}

interface AnalyzeCVsResponse {
  success: boolean;
  data: {
    analyzed: number;
    failed: number;
    results: {
      candidateId: string;
      status: 'success' | 'failed';
      score?: number;
      error?: string;
    }[];
  };
}

interface CandidatesResponse {
  success: boolean;
  data: {
    candidates: Candidate[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    averageScore: number;
  };
}

interface CandidateResponse {
  success: boolean;
  data: {
    candidate: Candidate;
  };
}

class CandidatesService {
  /**
   * Upload multiple CV files for a job post
   */
  async uploadCVs(jobId: string, files: File[]): Promise<UploadCVsResponse['data']> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<UploadCVsResponse>(
      `/job-posts/${jobId}/upload-cvs`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  }

  /**
   * Analyze CVs with AI (Gemini)
   */
  async analyzeCVs(jobId: string, candidateIds: string[]): Promise<AnalyzeCVsResponse['data']> {
    const response = await api.post<AnalyzeCVsResponse>(
      `/job-posts/${jobId}/analyze-cvs`,
      { candidateIds }
    );

    return response.data.data;
  }

  /**
   * Get ALL candidates (all jobs) - for Pipeline page
   */
  async getAllCandidates(
    params?: {
      status?: Candidate['status'];
      minScore?: number;
      maxScore?: number;
      skills?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }
  ): Promise<CandidatesResponse['data']> {
    const response = await api.get<CandidatesResponse>(
      `/candidates`,
      { params }
    );

    return response.data.data;
  }

  /**
   * Get candidates for a job post (sorted by score)
   */
  async getCandidates(
    jobId: string,
    params?: {
      status?: Candidate['status'];
      minScore?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }
  ): Promise<CandidatesResponse['data']> {
    const response = await api.get<CandidatesResponse>(
      `/job-posts/${jobId}/candidates`,
      { params }
    );

    return response.data.data;
  }

  /**
   * Get candidate details
   */
  async getCandidate(id: string): Promise<Candidate> {
    console.log('📡 Appel API GET /candidates/' + id);
    const response = await api.get<CandidateResponse>(`/candidates/${id}`);
    console.log('📡 Réponse complète:', response);
    console.log('📡 response.data:', response.data);
    console.log('📡 response.data.data:', response.data.data);
    console.log('📡 response.data.data.candidate:', response.data.data?.candidate);
    
    // Essayer différentes structures de réponse
    if (response.data.data?.candidate) {
      return response.data.data.candidate;
    } else if (response.data.candidate) {
      return response.data.candidate;
    } else if (response.data.data) {
      return response.data.data;
    } else {
      console.error('❌ Structure de réponse inattendue');
      throw new Error('Structure de réponse API invalide');
    }
  }

  /**
   * Update candidate status
   */
  async updateCandidateStatus(
    id: string,
    status: Candidate['status'],
    notes?: string
  ): Promise<Candidate> {
    const response = await api.put<CandidateResponse>(`/candidates/${id}/status`, {
      status,
      notes,
    });

    return response.data.data.candidate;
  }

  /**
   * Add a note to a candidate
   */
  async addNote(id: string, note: string): Promise<Candidate> {
    const response = await api.post<CandidateResponse>(`/candidates/${id}/notes`, {
      note,
    });

    return response.data.data.candidate;
  }

  /**
   * Download original CV file
   */
  async downloadCV(id: string): Promise<Blob> {
    const response = await api.get(`/candidates/${id}/download-cv`, {
      responseType: 'blob',
    });

    return response.data;
  }

  /**
   * Delete a candidate
   */
  async deleteCandidate(id: string): Promise<void> {
    await api.delete(`/candidates/${id}`);
  }
}

export const candidatesService = new CandidatesService();
