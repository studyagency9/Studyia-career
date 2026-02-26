import { useState } from 'react';
import { CandidateFilters } from '@/components/pro/CandidateFilters';
import { ScoreBadge } from '@/components/pro/ScoreBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Eye, Download, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/i18nContext';

interface Candidate {
  id: number;
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
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [candidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'Aminata Diallo',
      email: 'aminata.diallo@email.com',
      position: 'Senior Software Engineer',
      city: 'Dakar',
      degree: 'Master',
      experience: 5,
      score: 92,
      appliedDate: '2026-02-20',
      gender: 'F',
    },
    {
      id: 2,
      name: 'Mamadou Sow',
      email: 'mamadou.sow@email.com',
      position: 'Product Manager',
      city: 'Abidjan',
      degree: 'Bachelor',
      experience: 3,
      score: 78,
      appliedDate: '2026-02-19',
      gender: 'M',
    },
    {
      id: 3,
      name: 'Fatou Ndiaye',
      email: 'fatou.ndiaye@email.com',
      position: 'UX Designer',
      city: 'Douala',
      degree: 'Master',
      experience: 4,
      score: 85,
      appliedDate: '2026-02-18',
      gender: 'F',
    },
    {
      id: 4,
      name: 'Ibrahima Kane',
      email: 'ibrahima.kane@email.com',
      position: 'Senior Software Engineer',
      city: 'Dakar',
      degree: 'PhD',
      experience: 7,
      score: 95,
      appliedDate: '2026-02-17',
      gender: 'M',
    },
    {
      id: 5,
      name: 'Aissatou Diop',
      email: 'aissatou.diop@email.com',
      position: 'Data Analyst',
      city: 'Yaoundé',
      degree: 'Master',
      experience: 2,
      score: 68,
      appliedDate: '2026-02-16',
      gender: 'F',
    },
  ]);

  const toggleCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedCandidates(
      selectedCandidates.length === candidates.length
        ? []
        : candidates.map((c) => c.id)
    );
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('pro.pipeline.title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('pro.pipeline.subtitle')}
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
                    checked={selectedCandidates.length === candidates.length}
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
              {candidates.map((candidate, index) => (
                <motion.tr
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => toggleCandidate(candidate.id)}
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
              ))}
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
