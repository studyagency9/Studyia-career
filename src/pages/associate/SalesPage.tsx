import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, ArrowLeft, Sparkles, TrendingUp, DollarSign, Target, Check, X, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const SalesPage = () => {
  const { sales, stats } = useAssociateAuth();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'validated' | 'pending' | 'cancelled'>('all');

  const filteredSales = sales.filter(sale => {
    const matchesSearch = !searchTerm || 
      sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      validated: {
        style: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
        label: t('associate.sales.statusValidated'),
        icon: <Check className="w-3 h-3" />
      },
      pending: {
        style: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
        label: t('associate.sales.statusPending'),
        icon: <Clock className="w-3 h-3" />
      },
      cancelled: {
        style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
        label: t('associate.sales.statusCancelled'),
        icon: <X className="w-3 h-3" />
      },
    };
    
    const statusConfig = config[status as keyof typeof config];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.style}`}>
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
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
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <Link to="/associate/dashboard">
            <Button variant="outline" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              {t('associate.common.backToDashboard')}
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 border border-primary/20 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {t('associate.sales.badge')}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              {t('associate.sales.title')}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {t('associate.sales.subtitle')}
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('associate.sales.totalSales')}</p>
            </div>
            <p className="text-4xl font-bold">{stats.allTime.sales}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-card to-green-500/5 border-green-500/20 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('associate.sales.totalCommissions')}</p>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {stats.allTime.commission.toLocaleString()} FCFA
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-card to-blue-600/5 border-blue-600/20 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('associate.sales.avgCommission')}</p>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {stats.allTime.sales > 0 
                ? Math.round(stats.allTime.commission / stats.allTime.sales).toLocaleString() 
                : 0} FCFA
            </p>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
        <Card className="p-6 mb-6 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('associate.sales.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="lg"
                className={statusFilter === 'all' ? 'bg-gradient-to-r from-primary to-blue-600' : ''}
              >
                {t('associate.sales.filterAll')}
              </Button>
              <Button
                variant={statusFilter === 'validated' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('validated')}
                size="lg"
                className={statusFilter === 'validated' ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}
              >
                {t('associate.sales.filterValidated')}
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="lg"
                className={statusFilter === 'pending' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : ''}
              >
                {t('associate.sales.filterPending')}
              </Button>
            </div>
          </div>
        </Card>
        </motion.div>

        {/* Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
        <Card className="overflow-hidden bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wide">{t('associate.sales.tableClient')}</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wide">{t('associate.sales.tableType')}</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wide">{t('associate.sales.tableCommission')}</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wide">{t('associate.sales.tableStatus')}</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wide">{t('associate.sales.tableDate')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          <Search className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="font-medium text-muted-foreground">{t('associate.sales.noSales')}</p>
                        <p className="text-sm text-muted-foreground">{t('associate.sales.noSalesDesc')}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent transition-all"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {sale.customerName || t('associate.sales.anonymousClient')}
                          </p>
                          {sale.customerEmail && (
                            <p className="text-sm text-muted-foreground">
                              {sale.customerEmail}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">
                          {sale.cvType === 'public' ? t('associate.sales.publicCV') : t('associate.sales.partnerSaaS')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">
                          +{sale.commissionAmount.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(sale.status)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesPage;
