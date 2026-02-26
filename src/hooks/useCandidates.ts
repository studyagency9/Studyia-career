import { useState, useEffect } from 'react';
import { candidatesService, type Candidate } from '@/services/candidatesService';
import { useToast } from './use-toast';

export const useCandidates = (jobId: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [averageScore, setAverageScore] = useState(0);
  const { toast } = useToast();

  const fetchCandidates = async (params?: {
    status?: Candidate['status'];
    minScore?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    if (!jobId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await candidatesService.getCandidates(jobId, params);
      setCandidates(data.candidates);
      setAverageScore(data.averageScore);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des candidats';
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

  const uploadCVs = async (files: File[]) => {
    if (!jobId) return;

    setLoading(true);
    try {
      const result = await candidatesService.uploadCVs(jobId, files);
      toast({
        title: 'CV uploadés',
        description: `${result.totalUploaded} CV ont été uploadés avec succès`,
      });
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'upload des CV';
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

  const analyzeCVs = async (candidateIds: string[]) => {
    if (!jobId) return;

    setLoading(true);
    try {
      const result = await candidatesService.analyzeCVs(jobId, candidateIds);
      toast({
        title: 'Analyse terminée',
        description: `${result.analyzed} CV analysés avec succès`,
      });
      // Refresh candidates list
      await fetchCandidates();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'analyse des CV';
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

  const updateCandidateStatus = async (
    candidateId: string,
    status: Candidate['status'],
    notes?: string
  ) => {
    setLoading(true);
    try {
      const updated = await candidatesService.updateCandidateStatus(candidateId, status, notes);
      // Update local state
      setCandidates((prev) =>
        prev.map((c) => (c._id === candidateId ? updated : c))
      );
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut du candidat a été modifié',
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

  const addNote = async (candidateId: string, note: string) => {
    setLoading(true);
    try {
      const updated = await candidatesService.addNote(candidateId, note);
      setCandidates((prev) =>
        prev.map((c) => (c._id === candidateId ? updated : c))
      );
      toast({
        title: 'Note ajoutée',
        description: 'La note a été enregistrée',
      });
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'ajout de la note';
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

  const downloadCV = async (candidateId: string, fileName: string) => {
    setLoading(true);
    try {
      const blob = await candidatesService.downloadCV(candidateId);
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Téléchargement réussi',
        description: 'Le CV a été téléchargé',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du téléchargement';
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

  const deleteCandidate = async (candidateId: string) => {
    setLoading(true);
    try {
      await candidatesService.deleteCandidate(candidateId);
      setCandidates((prev) => prev.filter((c) => c._id !== candidateId));
      toast({
        title: 'Candidat supprimé',
        description: 'Le candidat a été supprimé',
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

  useEffect(() => {
    if (jobId) {
      fetchCandidates({ sortBy: 'matchingAnalysis.globalScore', sortOrder: 'desc' });
    }
  }, [jobId]);

  return {
    candidates,
    loading,
    error,
    averageScore,
    fetchCandidates,
    uploadCVs,
    analyzeCVs,
    updateCandidateStatus,
    addNote,
    downloadCV,
    deleteCandidate,
  };
};

export const useCandidate = (id: string) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await candidatesService.getCandidate(id);
        setCandidate(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erreur lors du chargement du candidat';
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

    fetchCandidate();
  }, [id]);

  return {
    candidate,
    loading,
    error,
  };
};
