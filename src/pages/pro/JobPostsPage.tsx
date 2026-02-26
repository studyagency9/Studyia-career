import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/i18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobPostCard } from '@/components/pro/JobPostCard';
import { 
  Plus, 
  Search, 
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { JobPost, JobStatus } from '@/types/jobPost';

const JobPostsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'candidates'>('recent');

  // Mock data - À remplacer par des données réelles de l'API
  const [jobPosts] = useState<JobPost[]>([
    {
      id: '1',
      title: 'Développeur Full-Stack Senior',
      description: 'Nous recherchons un développeur Full-Stack expérimenté pour rejoindre notre équipe technique. Vous travaillerez sur des projets innovants utilisant React, Node.js et PostgreSQL.',
      company: 'TechCorp Sénégal',
      city: 'Dakar',
      country: 'Sénégal',
      remote: true,
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
      optionalSkills: ['AWS', 'Kubernetes'],
      education: ['bachelor', 'master'],
      experience: 'senior',
      minYearsExperience: 5,
      contractType: 'full_time',
      salaryMin: 800000,
      salaryMax: 1200000,
      currency: 'XOF',
      deadline: '2026-03-30',
      startDate: '2026-04-15',
      status: 'active',
      isUrgent: true,
      createdBy: 'user-1',
      createdAt: '2026-02-20T10:00:00Z',
      updatedAt: '2026-02-24T14:30:00Z',
      publishedAt: '2026-02-20T10:00:00Z',
      stats: {
        totalCandidates: 45,
        newCandidates: 8,
        reviewedCandidates: 30,
        shortlistedCandidates: 12,
        rejectedCandidates: 3,
        averageScore: 78,
        topScore: 95,
        viewCount: 234,
      },
    },
    {
      id: '2',
      title: 'Chef de Projet Digital',
      description: 'Pilotez nos projets digitaux de A à Z. Expérience en méthodologie Agile requise.',
      company: 'Digital Agency',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      remote: false,
      requiredSkills: ['Gestion de projet', 'Agile', 'Scrum', 'Communication'],
      optionalSkills: ['JIRA', 'Confluence'],
      education: ['master'],
      experience: 'mid',
      minYearsExperience: 3,
      contractType: 'full_time',
      salaryMin: 600000,
      salaryMax: 900000,
      currency: 'XOF',
      deadline: '2026-03-15',
      status: 'active',
      isUrgent: false,
      createdBy: 'user-1',
      createdAt: '2026-02-18T09:00:00Z',
      updatedAt: '2026-02-18T09:00:00Z',
      publishedAt: '2026-02-18T09:00:00Z',
      stats: {
        totalCandidates: 32,
        newCandidates: 5,
        reviewedCandidates: 25,
        shortlistedCandidates: 8,
        rejectedCandidates: 2,
        averageScore: 72,
        topScore: 88,
        viewCount: 156,
      },
    },
    {
      id: '3',
      title: 'Designer UX/UI',
      description: 'Créez des expériences utilisateur exceptionnelles pour nos applications web et mobile.',
      company: 'StartupHub',
      city: 'Dakar',
      country: 'Sénégal',
      remote: true,
      requiredSkills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
      optionalSkills: ['Illustration', 'Animation'],
      education: ['bachelor'],
      experience: 'junior',
      minYearsExperience: 2,
      contractType: 'full_time',
      salaryMin: 400000,
      salaryMax: 700000,
      currency: 'XOF',
      deadline: '2026-04-10',
      status: 'draft',
      isUrgent: false,
      createdBy: 'user-1',
      createdAt: '2026-02-23T15:00:00Z',
      updatedAt: '2026-02-24T10:00:00Z',
      stats: {
        totalCandidates: 0,
        newCandidates: 0,
        reviewedCandidates: 0,
        shortlistedCandidates: 0,
        rejectedCandidates: 0,
        averageScore: 0,
        topScore: 0,
        viewCount: 0,
      },
    },
  ]);

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offres d'emploi</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos offres et suivez les candidatures
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2"
          onClick={() => navigate('/pro/jobs/create')}
        >
          <Plus className="w-5 h-5" />
          Créer une offre
        </Button>
      </motion.div>

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
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Rechercher par titre, entreprise ou ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <JobPostCard
                job={job}
                onView={(id) => navigate(`/pro/pipeline?job=${id}`)}
                onEdit={(id) => navigate(`/pro/jobs/edit/${id}`)}
                onArchive={(id) => console.log('Archive:', id)}
                onDelete={(id) => console.log('Delete:', id)}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500">Aucune offre trouvée</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobPostsPage;
