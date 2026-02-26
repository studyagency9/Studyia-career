import { StatCard } from '@/components/pro/StatCard';
import { Users, Briefcase, TrendingUp, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/i18nContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { jobPostsService } from '@/services/jobPostsService';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { partner } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch analytics data
        const analytics = await analyticsService.getDashboard('month');
        setDashboardData(analytics);

        // Fetch recent job posts
        const { jobPosts } = await jobPostsService.getJobPosts({
          status: 'active',
          limit: 3,
        });
        setRecentJobs(jobPosts);
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
        // Fallback to mock data if API fails
        setDashboardData({
          totalApplications: 0,
          activeJobPosts: 0,
          averageScore: 0,
          newApplications: 0,
        });
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: t('pro.dashboard.totalCandidates'),
      value: loading ? '...' : dashboardData?.totalApplications?.toString() || '0',
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: t('pro.dashboard.activePosts'),
      value: loading ? '...' : dashboardData?.activeJobPosts?.toString() || '0',
      icon: Briefcase,
      color: 'green' as const,
    },
    {
      title: t('pro.dashboard.avgScore'),
      value: loading ? '...' : `${dashboardData?.averageScore || 0}%`,
      icon: TrendingUp,
      color: 'purple' as const,
    },
    {
      title: 'Nouvelles candidatures',
      value: loading ? '...' : dashboardData?.newApplications?.toString() || '0',
      icon: Clock,
      color: 'orange' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour, {partner?.firstName} {partner?.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <p className="font-medium">{partner?.company}</p>
          </div>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          onClick={() => navigate('/pro/jobs/create')}
        >
          {t('pro.dashboard.createPost')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('pro.dashboard.activeJobPosts')}</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/pro/jobs')}>
            {t('pro.dashboard.viewAll')}
          </Button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune offre active. Créez votre première offre !
            </div>
          ) : (
            recentJobs.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {post.stats?.totalCandidates || 0} {t('pro.dashboard.candidates')} • {t('pro.dashboard.deadline')}: {new Date(post.deadline).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {t('pro.dashboard.active')}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/pro/jobs/${post._id || post.id}`)}>
                  {t('pro.dashboard.view')}
                </Button>
              </div>
            </motion.div>
          ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">{t('pro.dashboard.reviewTopCandidates')}</h3>
          <p className="text-blue-100 text-sm">
            {t('pro.dashboard.reviewTopCandidatesDesc')}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">{t('pro.dashboard.viewAnalytics')}</h3>
          <p className="text-purple-100 text-sm">
            {t('pro.dashboard.viewAnalyticsDesc')}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">{t('pro.dashboard.sendInvitations')}</h3>
          <p className="text-green-100 text-sm">
            {t('pro.dashboard.sendInvitationsDesc')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
