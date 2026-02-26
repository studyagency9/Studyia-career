import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { JobPost } from '@/types/jobPost';
import { jobStatusLabels, contractTypeLabels } from '@/types/jobPost';
import { useTranslation } from '@/i18n/i18nContext';

interface JobPostCardProps {
  job: JobPost;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const JobPostCard = ({ job, onView, onEdit, onArchive, onDelete }: JobPostCardProps) => {
  const { language } = useTranslation();
  
  const statusConfig = jobStatusLabels[job.status];
  const contractLabel = contractTypeLabels[job.contractType][language];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'closed': return 'bg-red-100 text-red-700 border-red-200';
      case 'archived': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                {job.title}
              </h3>
              {job.isUrgent && (
                <Badge variant="destructive" className="animate-pulse">
                  Urgent
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {job.company}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(job.status)} border`}>
              {statusConfig[language]}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(job.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Voir les candidats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(job.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onArchive?.(job.id)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(job.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Details */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {job.city}, {job.country}
            {job.remote && (
              <Badge variant="outline" className="ml-1 text-xs">
                Remote
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            {contractLabel}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {daysUntilDeadline > 0 ? (
              <span className={daysUntilDeadline <= 7 ? 'text-orange-600 font-medium' : ''}>
                {daysUntilDeadline} jours restants
              </span>
            ) : (
              <span className="text-red-600 font-medium">Expiré</span>
            )}
          </div>
        </div>

        {/* Skills */}
        {job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.requiredSkills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.requiredSkills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{job.requiredSkills.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {job.stats.totalCandidates}
              </span>
              <span className="text-xs text-gray-500">candidats</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {job.stats.averageScore}%
              </span>
              <span className="text-xs text-gray-500">score moy.</span>
            </div>
          </div>
          
          {job.stats.newCandidates > 0 && (
            <Badge variant="default" className="bg-blue-600">
              {job.stats.newCandidates} nouveau{job.stats.newCandidates > 1 ? 'x' : ''}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};
