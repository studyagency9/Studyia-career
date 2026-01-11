import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Copy, Share2, Download, Eye, ArrowLeft, LogOut, Sparkles, Zap, Target, Check, ExternalLink, ChevronRight, BarChart3, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { InstallPWAPrompt } from '@/components/InstallPWAPrompt';

const DashboardPage = () => {
  const { associate, stats, balance, sales, logout } = useAssociateAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);

  if (!associate) return null;

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      
      // Déclencher le prompt PWA lors de la première copie du lien
      const hasTriggeredPWA = localStorage.getItem('studyia_associate_pwa_triggered');
      console.log('🔍 Copie du lien - hasTriggeredPWA:', hasTriggeredPWA);
      if (!hasTriggeredPWA) {
        console.log('✅ Déclenchement du prompt PWA dans 1 seconde...');
        localStorage.setItem('studyia_associate_pwa_triggered', 'true');
        setTimeout(() => {
          console.log('🚀 Affichage du prompt PWA maintenant');
          setShowPWAPrompt(true);
        }, 1000);
      } else {
        console.log('⚠️ Prompt PWA déjà déclenché auparavant');
      }
    }
    toast({
      title: t('associate.dashboard.copied'),
      description: type === 'code' ? t('associate.dashboard.codeCopied') : t('associate.dashboard.linkCopied'),
    });
  };

  const shareOnWhatsApp = () => {
    const message = `🎯 Créez votre CV professionnel gratuitement avec Studyia Career !\n\n✨ Utilisez mon lien : ${associate.referralLink}\n\nCode de parrainage : ${associate.referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(associate.referralLink)}`, '_blank');
  };

  const recentSales = sales.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 md:p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('associate.common.backToHome')}</span>
                </Button>
              </Link>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {associate.firstName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{associate.firstName} {associate.lastName}</h2>
                    <p className="text-xs text-muted-foreground">{associate.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/associate/login');
                }}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('associate.common.logout')}</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 border border-primary/20 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {t('associate.dashboard.badge')}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              {t('associate.dashboard.welcome')}, {associate.firstName} ! 👋
            </span>
          </h1>
          <p className="text-muted-foreground">
            {t('associate.dashboard.subtitle')}
          </p>
        </motion.div>

        {/* Balance Card - Large and prominent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary via-blue-600 to-green-600 text-white border-0 shadow-2xl overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5" />
                <span className="text-white/80 text-sm font-medium">{t('associate.dashboard.balanceAvailable')}</span>
              </div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {balance.available.toLocaleString()} <span className="text-2xl md:text-4xl">FCFA</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white/70 text-xs mb-1">{t('associate.dashboard.balancePending')}</p>
                      <p className="font-bold text-lg">{balance.pending.toLocaleString()} FCFA</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white/70 text-xs mb-1">{t('associate.dashboard.balanceWithdrawn')}</p>
                      <p className="font-bold text-lg">{balance.withdrawn.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/associate/withdraw" className="w-full lg:w-auto">
                  <Button size="lg" variant="secondary" className="w-full lg:w-auto whitespace-nowrap shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    <Download className="w-5 h-5 mr-2" />
                    {t('associate.dashboard.withdrawButton')}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
        >
          <Link to="/associate/sales" className="block">
            <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">{t('associate.dashboard.mySales')}</p>
            </Card>
          </Link>
          
          <Link to="/associate/withdraw" className="block">
            <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-green-500/5 border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <Download className="w-5 h-5 text-green-600" />
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">{t('associate.dashboard.withdraw')}</p>
            </Card>
          </Link>
          
          <button
            onClick={() => copyToClipboard(associate.referralLink, 'link')}
            className="block w-full"
          >
            <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-blue-600/5 border-blue-600/20">
              <div className="flex items-center justify-between mb-2">
                <Copy className="w-5 h-5 text-blue-600" />
                {copiedLink && <Check className="w-4 h-4 text-green-600" />}
              </div>
              <p className="font-semibold text-sm">{t('associate.dashboard.copyLink')}</p>
            </Card>
          </button>
          
          <button
            onClick={shareOnWhatsApp}
            className="block w-full"
          >
            <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-green-600/5 border-green-600/20">
              <div className="flex items-center justify-between mb-2">
                <Share2 className="w-5 h-5 text-green-600" />
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">{t('associate.dashboard.share')}</p>
            </Card>
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-4 md:p-6 bg-gradient-to-br from-card to-green-500/5 border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t('associate.dashboard.statsToday')}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.today.sales}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('associate.dashboard.sales')}</p>
              <p className="text-base md:text-lg font-bold text-green-600">
                +{stats.today.commission.toLocaleString()} FCFA
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-4 md:p-6 bg-gradient-to-br from-card to-blue-600/5 border-blue-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t('associate.dashboard.statsWeek')}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.thisWeek.sales}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('associate.dashboard.sales')}</p>
              <p className="text-base md:text-lg font-bold text-blue-600">
                +{stats.thisWeek.commission.toLocaleString()} FCFA
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-4 md:p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg">
                  <DollarSign className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t('associate.dashboard.statsMonth')}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.thisMonth.sales}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('associate.dashboard.sales')}</p>
              <p className="text-base md:text-lg font-bold text-primary">
                +{stats.thisMonth.commission.toLocaleString()} FCFA
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-4 md:p-6 bg-gradient-to-br from-card to-orange-500/5 border-orange-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Target className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t('associate.dashboard.statsTotal')}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.allTime.sales}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">{t('associate.dashboard.totalSales')}</p>
              <p className="text-base md:text-lg font-bold text-orange-600">
                {stats.allTime.commission.toLocaleString()} FCFA
              </p>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          {/* Referral Link Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-green-600">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('associate.dashboard.referralTitle')}</h3>
                  <p className="text-xs text-muted-foreground">{t('associate.dashboard.referralSubtitle')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t('associate.dashboard.referralCode')}</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-4 bg-gradient-to-br from-primary/10 to-green-500/10 rounded-xl font-mono text-xl font-bold border border-primary/20">
                      {associate.referralCode}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => copyToClipboard(associate.referralCode, 'code')}
                      className="px-4"
                    >
                      {copiedCode ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t('associate.dashboard.referralLink')}</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-4 bg-muted/50 rounded-xl text-sm break-all border border-border">
                      {associate.referralLink}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => copyToClipboard(associate.referralLink, 'link')}
                      className="px-4"
                    >
                      {copiedLink ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <p className="text-sm font-medium text-muted-foreground mb-3">{t('associate.dashboard.shareOn')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={shareOnWhatsApp}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t('associate.dashboard.whatsapp')}
                    </Button>
                    <Button
                      onClick={shareOnFacebook}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t('associate.dashboard.facebook')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Sales */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
            <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-primary">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('associate.dashboard.recentSales')}</h3>
                    <p className="text-xs text-muted-foreground">{t('associate.dashboard.recentSalesCount')}</p>
                  </div>
                </div>
                <Link to="/associate/sales">
                  <Button variant="outline" size="sm" className="gap-2">
                    {t('associate.dashboard.viewAll')}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {recentSales.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium mb-1">{t('associate.dashboard.noSales')}</p>
                  <p className="text-sm">{t('associate.dashboard.noSalesDesc')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSales.map((sale, index) => (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all border border-border/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {sale.customerName || t('associate.dashboard.anonymousClient')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.cvType === 'public' ? t('associate.dashboard.publicCV') : t('associate.dashboard.partnerSaaS')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +{sale.commissionAmount.toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 md:mt-8"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/10 via-green-500/10 to-blue-600/10 border-primary/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-green-600 flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold mb-3">💡 {t('associate.dashboard.tipsTitle')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t('associate.dashboard.tip1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t('associate.dashboard.tip2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t('associate.dashboard.tip3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{t('associate.dashboard.tip4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* PWA Install Prompt */}
      <InstallPWAPrompt 
        triggerShow={showPWAPrompt} 
        onClose={() => setShowPWAPrompt(false)} 
      />
    </div>
  );
};

export default DashboardPage;
