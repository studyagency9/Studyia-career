import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CandidateFilters } from '@/components/pro/CandidateFilters';
import { ScoreBadge } from '@/components/pro/ScoreBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Eye, Download, MoreVertical, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/i18nContext';
import { useCandidates } from '@/hooks/useCandidates';
import type { Candidate as APICandidate } from '@/services/candidatesService';

interface Candidate {
  id: string | number;
  name: string;
  email: string;
  position: string;
  city: string;
  degree: string;
  experience: number;
  score: number;
  appliedDate: string;
  gender: string;
}

const PipelinePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  
  const { candidates: apiCandidates, loading } = useCandidates(jobId || '');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // Convert API candidates to display format - no mocks
  const displayCandidates: Candidate[] = apiCandidates.map(c => ({
    id: c._id,
    name: `${c.cvData.personalInfo.firstName} ${c.cvData.personalInfo.lastName}`,
    email: c.cvData.personalInfo.email,
    position: c.cvData.experiences[0]?.position || 'Non spécifié',
    city: c.cvData.personalInfo.city,
    degree: c.cvData.education[0]?.degree || 'Non spécifié',
    experience: c.cvData.experiences.length,
    score: c.matchingAnalysis?.globalScore || 0,
    appliedDate: new Date(c.createdAt).toISOString().split('T')[0],
    gender: 'N/A',
  }));

  const toggleCandidate = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedCandidates.length === displayCandidates.length) {
      setSelectedCandidates([]);
    } else {
      const ids: string[] = displayCandidates.map((c) => String(c.id));
      setSelectedCandidates(ids);
    }
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de candidats</h1>
          <p className="mt-2 text-gray-600">
            Gérez et suivez vos candidats
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCandidates.length > 0 && (
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              {t('pro.pipeline.contactSelected').replace('{count}', selectedCandidates.length.toString())}
            </Button>
          )}
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2">
            <Download className="w-4 h-4" />
            {t('pro.pipeline.exportCSV')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CandidateFilters onFilterChange={handleFilterChange} />

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <Checkbox
                    checked={selectedCandidates.length === displayCandidates.length && displayCandidates.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.candidate')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.position')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.location')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.education')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.experience')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.score')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.applied')}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {t('pro.pipeline.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
            <tr>
              <td colSpan={9} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Chargement des candidats...</p>
                </div>
              </td>
            </tr>
          ) : displayCandidates.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-16">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-full p-5 mb-4">
                    <Users className="w-12 h-12 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun candidat pour le moment
                  </h3>
                  <p className="text-gray-600 text-sm max-w-md">
                    {!jobId 
                      ? 'Sélectionnez une offre d\'emploi pour voir les candidats'
                      : 'Commencez à recevoir des candidatures en partageant votre offre d\'emploi'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            displayCandidates.map((candidate, index) => (
                <motion.tr
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedCandidates.includes(String(candidate.id))}
                      onCheckedChange={() => toggleCandidate(String(candidate.id))}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{candidate.position}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{candidate.city}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{candidate.degree}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {candidate.experience} {t('pro.pipeline.years')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={candidate.score} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        {t('pro.dashboard.view')}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            {t('pro.pipeline.sendEmail')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            {t('pro.pipeline.downloadCV')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              ))
          )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t('pro.pipeline.showing')} <span className="font-medium">1-5</span> {t('pro.pipeline.of')}{' '}
          <span className="font-medium">247</span> {t('pro.dashboard.candidates')}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            {t('pro.pipeline.previous')}
          </Button>
          <Button variant="outline" size="sm">
            {t('pro.pipeline.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;
