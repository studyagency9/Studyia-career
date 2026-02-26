import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/i18nContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobPostCard } from '@/components/pro/JobPostCard';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { CannotDeleteModal } from '@/components/ui/CannotDeleteModal';
import { 
  Plus, 
  Search, 
  Filter,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { JobPost, JobStatus } from '@/types/jobPost';
import { useJobPosts } from '@/hooks/useJobPosts';
import { jobPostsService } from '@/services/jobPostsService';

const JobPostsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobPosts, loading, fetchJobPosts, deleteJobPost } = useJobPosts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'candidates'>('recent');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; jobId: string; jobTitle: string }>({ 
    isOpen: false, 
    jobId: '', 
    jobTitle: '' 
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [cannotDeleteModal, setCannotDeleteModal] = useState<{ 
    isOpen: boolean; 
    jobId: string; 
    jobTitle: string; 
    candidateCount: number 
  }>({ 
    isOpen: false, 
    jobId: '', 
    jobTitle: '', 
    candidateCount: 0 
  });
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    console.log('🔍 JobPostsPage: Fetching job posts from API...');
    fetchJobPosts({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchQuery || undefined,
    }).then(() => {
      console.log('✅ JobPostsPage: API response received, jobPosts count:', jobPosts.length);
    }).catch((error) => {
      console.error('❌ JobPostsPage: API error:', error);
    });
  }, [statusFilter, searchQuery]);

  const handleSearch = () => {
    fetchJobPosts({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchQuery || undefined,
    });
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, jobId: id, jobTitle: title });
  };

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      await jobPostsService.updateJobPost(cannotDeleteModal.jobId, { status: 'archived' });
      await fetchJobPosts({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setCannotDeleteModal({ isOpen: false, jobId: '', jobTitle: '', candidateCount: 0 });
      toast({
        title: '📦 Offre archivée',
        description: 'L\'offre d\'emploi a été archivée avec succès',
      });
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.error || 'Impossible d\'archiver l\'offre',
        variant: 'destructive',
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteJobPost(deleteModal.jobId);
      // Rafraîchir la liste après suppression
      await fetchJobPosts({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' });
      toast({
        title: '✅ Offre supprimée',
        description: 'L\'offre d\'emploi a été supprimée avec succès',
      });
    } catch (error: any) {
      // Détecter l'erreur "existing candidates"
      if (error.response?.data?.error?.includes('existing candidates')) {
        const candidateCount = error.response?.data?.candidateCount || 0;
        setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' });
        setCannotDeleteModal({
          isOpen: true,
          jobId: deleteModal.jobId,
          jobTitle: deleteModal.jobTitle,
          candidateCount,
        });
      } else {
        toast({
          title: '❌ Erreur',
          description: error.response?.data?.error || 'Impossible de supprimer l\'offre',
          variant: 'destructive',
        });
        setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Using only real API data - no mocks
  const filteredJobs = jobPosts
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'candidates':
          return b.stats.totalCandidates - a.stats.totalCandidates;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const stats = {
    total: jobPosts.length,
    active: jobPosts.filter(j => j.status === 'active').length,
    draft: jobPosts.filter(j => j.status === 'draft').length,
    totalCandidates: jobPosts.reduce((sum, j) => sum + j.stats.totalCandidates, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes offres d'emploi</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos offres d'emploi et suivez les candidatures
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2"
          onClick={() => navigate('/pro/jobs/create')}
        >
          <Plus className="w-5 h-5" />
          Créer une offre
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Total des offres</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Offres actives</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Brouillons</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-600">Total candidats</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalCandidates}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une offre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="closed">Fermé</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="deadline">Date limite</SelectItem>
              <SelectItem value="candidates">Nb. candidats</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Job Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des offres...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job._id || job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <JobPostCard
                job={job}
                onView={(id) => navigate(`/pro/jobs/${id}`)}
                onEdit={(id) => navigate(`/pro/jobs/edit/${id}`)}
                onArchive={async (id) => {
                  try {
                    await jobPostsService.updateJobPost(id, { status: 'archived' });
                    await fetchJobPosts({
                      status: statusFilter === 'all' ? undefined : statusFilter,
                      search: searchQuery || undefined,
                    });
                    toast({
                      title: '📦 Offre archivée',
                      description: 'L\'offre d\'emploi a été archivée avec succès',
                    });
                  } catch (error: any) {
                    toast({
                      title: '❌ Erreur',
                      description: error.response?.data?.error || 'Impossible d\'archiver l\'offre',
                      variant: 'destructive',
                    });
                  }
                }}
                onDelete={(id) => handleDeleteClick(id, job.title)}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-20">
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-full p-6 mb-6">
              <Briefcase className="w-16 h-16 text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Aucune offre d'emploi pour le moment
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-8">
              Commencez à recruter les meilleurs talents en créant votre première offre d'emploi. 
              C'est simple et rapide !
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 gap-2"
              onClick={() => navigate('/pro/jobs/create')}
            >
              <Plus className="w-5 h-5" />
              Créer ma première offre
            </Button>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer cette offre d'emploi ?"
        description="Vous êtes sur le point de supprimer définitivement cette offre d'emploi."
        itemName={deleteModal.jobTitle}
        isDeleting={isDeleting}
      />

      <CannotDeleteModal
        isOpen={cannotDeleteModal.isOpen}
        onClose={() => setCannotDeleteModal({ isOpen: false, jobId: '', jobTitle: '', candidateCount: 0 })}
        onArchive={handleArchive}
        jobTitle={cannotDeleteModal.jobTitle}
        candidateCount={cannotDeleteModal.candidateCount}
        isArchiving={isArchiving}
      />
    </div>
  );
};

export default JobPostsPage;
