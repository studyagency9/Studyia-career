import { StatCard } from '@/components/pro/StatCard';
import { Users, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/i18nContext';

const DashboardPage = () => {
  const { t } = useTranslation();
  
  const stats = [
    {
      title: t('pro.dashboard.totalCandidates'),
      value: '1,247',
      icon: Users,
      trend: { value: 12, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: t('pro.dashboard.activePosts'),
      value: '23',
      icon: Briefcase,
      trend: { value: 3, isPositive: true },
      color: 'green' as const,
    },
    {
      title: t('pro.dashboard.avgScore'),
      value: '76%',
      icon: TrendingUp,
      trend: { value: 5, isPositive: true },
      color: 'purple' as const,
    },
    {
      title: t('pro.dashboard.timeToHire'),
      value: '14d',
      icon: Clock,
      trend: { value: 2, isPositive: false },
      color: 'orange' as const,
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      candidates: 45,
      status: 'active',
      deadline: '2026-03-15',
    },
    {
      id: 2,
      title: 'Product Manager',
      candidates: 32,
      status: 'active',
      deadline: '2026-03-20',
    },
    {
      id: 3,
      title: 'UX Designer',
      candidates: 28,
      status: 'active',
      deadline: '2026-03-18',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('pro.dashboard.title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('pro.dashboard.subtitle')}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
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
          <Button variant="outline" size="sm">
            {t('pro.dashboard.viewAll')}
          </Button>
        </div>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
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
                  {post.candidates} {t('pro.dashboard.candidates')} • {t('pro.dashboard.deadline')}: {post.deadline}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {t('pro.dashboard.active')}
                </span>
                <Button variant="ghost" size="sm">
                  {t('pro.dashboard.view')}
                </Button>
              </div>
            </motion.div>
          ))}
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
