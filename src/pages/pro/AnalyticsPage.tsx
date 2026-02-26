import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin, GraduationCap } from 'lucide-react';
import { useTranslation } from '@/i18n/i18nContext';

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const cityData = [
    { name: 'Dakar', candidates: 342 },
    { name: 'Abidjan', candidates: 256 },
    { name: 'Douala', candidates: 198 },
    { name: 'Yaoundé', candidates: 167 },
    { name: 'Lomé', candidates: 134 },
  ];

  const degreeData = [
    { name: 'Bachelor', value: 45, color: '#3B82F6' },
    { name: 'Master', value: 35, color: '#8B5CF6' },
    { name: 'PhD', value: 12, color: '#10B981' },
    { name: 'Other', value: 8, color: '#F59E0B' },
  ];

  const scoreDistribution = [
    { range: '0-20', count: 12 },
    { range: '21-40', count: 45 },
    { range: '41-60', count: 123 },
    { range: '61-80', count: 234 },
    { range: '81-100', count: 156 },
  ];

  const timeToHire = [
    { month: 'Jan', days: 18 },
    { month: 'Feb', days: 16 },
    { month: 'Mar', days: 14 },
    { month: 'Apr', days: 15 },
    { month: 'May', days: 13 },
    { month: 'Jun', days: 14 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('pro.analytics.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('pro.analytics.subtitle')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.totalApplications')}</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.avgScore')}</p>
              <p className="text-2xl font-bold text-gray-900">76%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.topCity')}</p>
              <p className="text-2xl font-bold text-gray-900">Dakar</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.mostCommon')}</p>
              <p className="text-2xl font-bold text-gray-900">Bachelor</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates by City */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('pro.analytics.candidatesByCity')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="candidates" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Education Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('pro.analytics.educationDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={degreeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {degreeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('pro.analytics.scoreDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time to Hire Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('pro.analytics.timeToHireTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeToHire}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="days"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 {t('pro.analytics.keyInsights')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.highestQuality')}</p>
            <p className="text-lg font-bold text-gray-900">{t('pro.analytics.dakarCandidates')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('pro.analytics.avgScoreValue')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.bestMonth')}</p>
            <p className="text-lg font-bold text-gray-900">{t('pro.analytics.february2026')}</p>
            <p className="text-xs text-gray-500 mt-1">342 {t('pro.analytics.applications')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{t('pro.analytics.fastestHiring')}</p>
            <p className="text-lg font-bold text-gray-900">{t('pro.analytics.may2026')}</p>
            <p className="text-xs text-gray-500 mt-1">13 {t('pro.analytics.daysAverage')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
