import { useState, useEffect } from 'react';
import { jobPostsService } from '@/services/jobPostsService';
import type { JobPost, CreateJobPostData } from '@/types/jobPost';
import { useToast } from './use-toast';

export const useJobPosts = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJobPosts = async (params?: {
    status?: 'draft' | 'active' | 'closed' | 'archived';
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobPostsService.getJobPosts(params);
      setJobPosts(data.jobPosts);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des offres';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createJobPost = async (data: CreateJobPostData) => {
    setLoading(true);
    setError(null);
    try {
      const jobPost = await jobPostsService.createJobPost(data);
      toast({
        title: 'Offre créée',
        description: 'L\'offre d\'emploi a été créée avec succès',
      });
      return jobPost;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de l\'offre';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishJobPost = async (id: string) => {
    setLoading(true);
    try {
      const jobPost = await jobPostsService.publishJobPost(id);
      toast({
        title: 'Offre publiée',
        description: 'L\'offre d\'emploi est maintenant active',
      });
      return jobPost;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la publication';
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeJobPost = async (id: string) => {
    setLoading(true);
    try {
      const jobPost = await jobPostsService.closeJobPost(id);
      toast({
        title: 'Offre fermée',
        description: 'L\'offre d\'emploi a été fermée',
      });
      return jobPost;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la fermeture';
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const duplicateJobPost = async (id: string) => {
    setLoading(true);
    try {
      const jobPost = await jobPostsService.duplicateJobPost(id);
      toast({
        title: 'Offre dupliquée',
        description: 'L\'offre a été dupliquée avec succès',
      });
      return jobPost;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la duplication';
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJobPost = async (id: string) => {
    setLoading(true);
    try {
      await jobPostsService.deleteJobPost(id);
      toast({
        title: 'Offre supprimée',
        description: 'L\'offre d\'emploi a été supprimée',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression';
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    jobPosts,
    loading,
    error,
    fetchJobPosts,
    createJobPost,
    publishJobPost,
    closeJobPost,
    duplicateJobPost,
    deleteJobPost,
  };
};

export const useJobPost = (id: string) => {
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobPost = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await jobPostsService.getJobPost(id);
        setJobPost(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erreur lors du chargement de l\'offre';
        setError(errorMessage);
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [id]);

  const updateJobPost = async (data: Partial<CreateJobPostData>) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const updated = await jobPostsService.updateJobPost(id, data);
      setJobPost(updated);
      toast({
        title: 'Offre mise à jour',
        description: 'Les modifications ont été enregistrées',
      });
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour';
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    jobPost,
    loading,
    error,
    updateJobPost,
  };
};
