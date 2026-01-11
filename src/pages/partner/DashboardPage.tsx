import { motion } from 'framer-motion';
import { FileText, Plus, TrendingUp, Clock, Sparkles, ArrowRight, Zap, AlertCircle, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PartnerLayout from '@/components/partner/PartnerLayout';
import { useTranslation } from '@/i18n/i18nContext';
import { DownloadAppDialog } from '@/components/DownloadAppDialog';

const DashboardPage = () => {
  const { partner, savedCVs, currentPlan, remainingQuota, quotaPercentage, canCreateCV } = useAuth();
  const { t } = useTranslation();

  const stats = [
    {
      label: t('home.partner.dashboard.statsCreated'),
      value: savedCVs.length,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: t('home.partner.dashboard.statsThisMonth'),
      value: savedCVs.filter(cv => {
        const cvDate = new Date(cv.createdAt);
        const now = new Date();
        return cvDate.getMonth() === now.getMonth() && cvDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: t('home.partner.dashboard.statsLastActivity'),
      value: savedCVs.length > 0 ? t('home.partner.dashboard.activityToday') : t('home.partner.dashboard.activityNone'),
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const recentCVs = savedCVs.slice(0, 5).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <PartnerLayout>
      <div className="p-8 lg:p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-blue-bright/5 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 via-primary/5 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-bright/5 to-transparent rounded-full blur-3xl -z-10" />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-blue-bright/15 to-primary/20 border-2 border-primary/30 mb-4 shadow-xl shadow-primary/20 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-sm font-bold text-primary tracking-wide">{t('home.partner.dashboard.badge')}</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-foreground via-primary to-blue-bright bg-clip-text text-transparent mb-3 leading-tight"
              >
                {t('home.partner.dashboard.welcome')}, {partner?.firstName}! 👋
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-muted-foreground text-lg md:text-xl font-medium"
              >
                {t('home.partner.dashboard.subtitle')}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Quota Card */}
        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card className={`p-8 border-2 relative overflow-hidden shadow-2xl backdrop-blur-sm ${
              quotaPercentage >= 90 ? 'border-destructive/50 bg-gradient-to-br from-destructive/10 via-red-500/5 to-destructive/10' :
              quotaPercentage >= 70 ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-yellow-500/10' :
              'border-primary/50 bg-gradient-to-br from-primary/10 via-blue-bright/5 to-purple-500/10'
            }`}>
              {/* Enhanced Decorative gradients */}
              <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 animate-pulse ${
                quotaPercentage >= 90 ? 'bg-gradient-to-br from-destructive to-red-600' :
                quotaPercentage >= 70 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                'bg-gradient-to-br from-primary to-blue-bright'
              }`} />
              <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                quotaPercentage >= 90 ? 'bg-red-500' :
                quotaPercentage >= 70 ? 'bg-orange-500' :
                'bg-purple-500'
              }`} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {t('home.partner.dashboard.plan')} {currentPlan.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {partner.cvUsedThisMonth} / {currentPlan.monthlyQuota} {t('home.partner.dashboard.cvUsed')}
                  </p>
                </div>
                <Link to="/partner/pricing">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Zap className="w-4 h-4" />
                    {t('home.partner.dashboard.changePlan')}
                  </Button>
                </Link>
              </div>

              {/* Enhanced Progress bar */}
              <div className="relative w-full h-5 bg-muted/50 rounded-full overflow-hidden mb-4 shadow-inner border border-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${quotaPercentage}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className={`absolute top-0 left-0 h-full rounded-full shadow-xl relative overflow-hidden ${
                    quotaPercentage >= 90 ? 'bg-gradient-to-r from-destructive via-red-500 to-red-600' :
                    quotaPercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-500' :
                    'bg-gradient-to-r from-primary via-blue-bright to-purple-500'
                  }`}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {remainingQuota} {t('home.partner.dashboard.cvRemaining')}
                </span>
                {quotaPercentage >= 90 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-1 text-destructive font-medium"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {t('home.partner.dashboard.quotaAlmostReached')}
                  </motion.div>
                )}
                {quotaPercentage >= 70 && quotaPercentage < 90 && (
                  <span className="text-yellow-600 font-medium">
                    {t('home.partner.dashboard.upgradeThink')}
                  </span>
                )}
              </div>

              {!canCreateCV && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ {t('home.partner.dashboard.quotaExhausted')}
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/30 border-2 border-border hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 relative overflow-hidden group cursor-pointer">
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-blue-bright/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl ${stat.bgColor} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('home.partner.dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/partner/create" className={!canCreateCV ? 'pointer-events-none opacity-50' : ''}>
              <motion.div
                whileHover={canCreateCV ? { scale: 1.02, y: -4 } : {}}
                whileTap={canCreateCV ? { scale: 0.98 } : {}}
                className="group relative"
              >
                {!canCreateCV && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl z-10">
                    <div className="text-center p-4">
                      <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                      <p className="text-sm font-medium text-destructive">{t('home.partner.dashboard.quotaExhaustedShort')}</p>
                    </div>
                  </div>
                )}
                <Card className="p-8 bg-gradient-to-br from-primary via-blue-bright to-purple-600 border-0 shadow-2xl shadow-primary/40 hover:shadow-3xl hover:shadow-primary/60 transition-all duration-500 cursor-pointer relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div 
                      className="w-20 h-20 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-primary-foreground/30"
                      whileHover={{ scale: 1.15, rotate: 12 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Plus className="w-10 h-10 text-primary-foreground drop-shadow-lg" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-extrabold text-primary-foreground mb-2 drop-shadow-md">
                        {t('home.partner.dashboard.createNewCV')}
                      </h3>
                      <p className="text-primary-foreground/90 text-base font-medium">
                        {t('home.partner.dashboard.createNewCVDesc')}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary-foreground group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Card>
              </motion.div>
            </Link>

            <Link to="/partner/cvs">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Card className="p-8 bg-gradient-to-br from-card via-muted/10 to-muted/30 border-2 border-border hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 cursor-pointer relative overflow-hidden">
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-blue-bright/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div 
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-blue-bright/10 shadow-xl border-2 border-border group-hover:border-primary/50 transition-all duration-300"
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FileText className="w-10 h-10 text-primary drop-shadow-md" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-extrabold text-foreground mb-2">
                        {t('home.partner.dashboard.viewAllCVs')}
                      </h3>
                      <p className="text-muted-foreground text-base font-medium">
                        {t('home.partner.dashboard.viewAllCVsDesc')}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </Card>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Recent CVs */}
        {recentCVs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t('home.partner.dashboard.recentCVs')}</h2>
              <Link to="/partner/cvs">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  {t('home.partner.dashboard.viewAll')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recentCVs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Link to={`/partner/builder/${cv.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.01, x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-6 bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                            {cv.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {cv.language.toUpperCase()}
                          </span>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {savedCVs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-12 text-center bg-card border-2 border-dashed border-border">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {t('home.partner.dashboard.emptyStateTitle')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('home.partner.dashboard.emptyStateDesc')}
              </p>
              <Link to="/partner/create">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all">
                  <Plus className="w-5 h-5 mr-2" />
                  {t('home.partner.dashboard.emptyStateCTA')}
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Download App Dialog */}
      <DownloadAppDialog />
    </PartnerLayout>
  );
};

export default DashboardPage;
