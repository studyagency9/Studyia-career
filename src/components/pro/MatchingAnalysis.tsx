import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, Award, AlertTriangle, Briefcase, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface MatchingAnalysisProps {
  analysis: {
    globalScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    recommendation?: string;
  };
}

export const MatchingAnalysis = ({ analysis }: MatchingAnalysisProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très bon';
    if (score >= 70) return 'Bon';
    if (score >= 60) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="space-y-6">
      {/* Score global */}
      <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Score de compatibilité
            </h3>
            <p className="text-sm text-gray-600">
              Analyse globale du profil
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getScoreBgColor(analysis.globalScore)} flex items-center justify-center shadow-lg`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {analysis.globalScore}
                </div>
                <div className="text-xs text-white/90">/ 100</div>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-2 -right-2"
            >
              <Award className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </motion.div>
          </motion.div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={getScoreColor(analysis.globalScore)}>
            {getScoreLabel(analysis.globalScore)}
          </Badge>
        </div>
      </Card>

      {/* Scores détaillés */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analyse détaillée
        </h3>
        <div className="space-y-4">
          <ScoreItem
            label="Compétences"
            score={analysis.skillsScore}
            icon={<Award className="w-4 h-4 text-violet-600" />}
          />
          <ScoreItem
            label="Expérience"
            score={analysis.experienceScore}
            icon={<Briefcase className="w-4 h-4 text-violet-600" />}
          />
          <ScoreItem
            label="Formation"
            score={analysis.educationScore}
            icon={<GraduationCap className="w-4 h-4 text-violet-600" />}
          />
        </div>
      </Card>

      {/* Compétences matchées */}
      {analysis.matchedSkills.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Compétences correspondantes
            </h3>
            <Badge variant="secondary" className="ml-auto">
              {analysis.matchedSkills.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.matchedSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Compétences manquantes */}
      {analysis.missingSkills.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Compétences manquantes
            </h3>
            <Badge variant="secondary" className="ml-auto">
              {analysis.missingSkills.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <XCircle className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Points forts */}
      {analysis.strengths.length > 0 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Points forts
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      )}

      {/* Points faibles */}
      {analysis.weaknesses.length > 0 && (
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Points d'amélioration
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>{weakness}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recommandation */}
      {analysis.recommendation && (
        <Card className="p-6 bg-violet-50 border-violet-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Recommandation
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis.recommendation}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const ScoreItem = ({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">{icon}</div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{score}/100</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${getColor(score)}`}
        />
      </div>
    </div>
  );
};
