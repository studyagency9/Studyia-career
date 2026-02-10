import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Smartphone, AlertCircle, ArrowLeft, Sparkles, Wallet, Check, Info, Zap, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const WithdrawPage = () => {
  const { balance, requestWithdrawal, fetchWithdrawals } = useAssociateAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'mobile_money'>('mobile_money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'Orange'>('MTN');
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalsHistory, setWithdrawalsHistory] = useState<any>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const minWithdrawal = 5000;
  const fees = {
    mobile_money: Math.max(500, (parseInt(amount) || 0) * 0.02),
  };

  const netAmount = (parseInt(amount) || 0) - fees[method];

  // Charger l'historique des retraits
  const loadWithdrawalsHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await fetchWithdrawals(1, 10);
      if (data) {
        setWithdrawalsHistory(data);
      }
    } catch (error) {
      // Erreur silencieuse pour ne pas ralentir l'interface
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Charger l'historique au montage du composant
  useEffect(() => {
    loadWithdrawalsHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const withdrawAmount = parseInt(amount);

    if (withdrawAmount < minWithdrawal) {
      toast({
        title: t('associate.withdraw.errorMinTitle'),
        description: `${t('associate.withdraw.errorMinDesc')} ${minWithdrawal.toLocaleString()} FCFA`,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (withdrawAmount > balance.available) {
      toast({
        title: t('associate.withdraw.errorBalanceTitle'),
        description: t('share.errorBalanceDesc'),
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const withdrawalData = {
        amount: withdrawAmount,
        paymentMethod: method,
        paymentDetails: {
          phoneNumber: mobileNumber,
          provider: provider
        }
      };

      const result = await requestWithdrawal(withdrawalData);
      
      if (result) {
        toast({
          title: t('associate.withdraw.successTitle'),
          description: t('associate.withdraw.successDesc'),
        });
        setAmount('');
        setMobileNumber('');
        
        // Recharger les données après un retrait réussi
        await loadWithdrawalsHistory();
        
        // Actualiser la page pour refléter les nouvelles données
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: t('associate.withdraw.errorTitle'),
          description: t('associate.withdraw.errorGeneric'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Erreur silencieuse pour ne pas ralentir l'interface
      toast({
        title: t('associate.withdraw.errorTitle'),
        description: t('associate.withdraw.errorGeneric'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

      <div className="container relative z-10 mx-auto px-4 py-4 md:py-8 max-w-5xl">
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
              {t('associate.withdraw.badge')}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              {t('associate.withdraw.title')}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {t('associate.withdraw.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Balance Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4 md:space-y-6"
          >
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary via-blue-600 to-green-600 text-white border-0 shadow-2xl overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-5 h-5" />
                  <p className="text-white/80 text-sm font-medium">{t('associate.withdraw.balanceAvailable')}</p>
                </div>
                <p className="text-5xl md:text-6xl font-bold mb-2">
                  {balance.available.toLocaleString()}
                </p>
                <p className="text-white/80 text-lg">FCFA</p>
              </div>
            </Card>

            {/* Pending and Completed Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pending Balance */}
              <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-orange-600 font-medium">En attente</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-orange-600 mb-1">
                  {isLoadingHistory ? (
                    <div className="animate-pulse bg-muted rounded w-20 h-8"></div>
                  ) : (
                    <>
                      {(withdrawalsHistory?.withdrawals
                        ?.filter((w: any) => w.status === 'pending')
                        ?.reduce((sum: number, w: any) => sum + w.amount, 0) || 0)
                        .toLocaleString()} FCFA
                    </>
                  )}
                </p>
               
              </Card>

              {/* Completed Balance */}
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-green-600 font-medium">Déjà retiré</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {isLoadingHistory ? (
                    <div className="animate-pulse bg-muted rounded w-20 h-8"></div>
                  ) : (
                    <>
                      {(withdrawalsHistory?.withdrawals
                        ?.filter((w: any) => w.status === 'completed')
                        ?.reduce((sum: number, w: any) => sum + w.amount, 0) || 0)
                        .toLocaleString()} FCFA
                    </>
                  )}
                </p>
                
              </Card>
            </div>

            <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-green-600">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">{t('associate.withdraw.infoTitle')}</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>{t('associate.withdraw.infoMinimum')}</strong> {minWithdrawal.toLocaleString()} FCFA</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>{t('associate.withdraw.infoDelay')}</strong> {t('associate.withdraw.delay24h')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>{t('associate.withdraw.infoFees')}</strong> {t('associate.withdraw.fees2percent')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>{t('associate.withdraw.infoMethods')}</strong> {t('associate.withdraw.methodsMTNOrange')}</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-green-600">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{t('associate.withdraw.formTitle')}</h2>
                  <p className="text-sm text-muted-foreground">{t('associate.withdraw.formSubtitle')}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-base font-semibold">{t('associate.withdraw.amountLabel')} *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder={t('associate.withdraw.amountPlaceholder')}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-12 h-14 text-lg font-semibold"
                      min={minWithdrawal}
                      max={balance.available}
                      required
                    />
                  </div>
                  {amount && parseInt(amount) >= minWithdrawal && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20"
                    >
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{t('associate.withdraw.amountRequested')}</span>
                        <span className="font-semibold">{parseInt(amount).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{t('associate.withdraw.processingFees')}</span>
                        <span className="font-semibold text-orange-600">-{fees[method].toLocaleString()} FCFA</span>
                      </div>
                      <div className="pt-2 border-t border-green-500/20">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-600">{t('associate.withdraw.youWillReceive')}</span>
                          <span className="text-2xl font-bold text-green-600">{netAmount.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Method Info */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-green-500/10 to-blue-600/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-green-600 flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{t('associate.withdraw.methodInfo')}</p>
                      <p className="text-sm text-muted-foreground">{t('associate.withdraw.methodDesc')}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Money Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('associate.withdraw.operatorLabel')} *</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setProvider('MTN')}
                        className={`p-6 rounded-2xl border-2 font-medium transition-all ${
                          provider === 'MTN'
                            ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg scale-105'
                            : 'border-border hover:border-primary/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            provider === 'MTN' 
                              ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
                              : 'bg-muted'
                          }`}>
                            <span className="text-2xl font-bold text-white">MTN</span>
                          </div>
                          <span className="font-bold">{t('associate.withdraw.mtnMoney')}</span>
                          {provider === 'MTN' && <Check className="w-5 h-5 text-primary" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProvider('Orange')}
                        className={`p-6 rounded-2xl border-2 font-medium transition-all ${
                          provider === 'Orange'
                            ? 'border-orange-500 bg-gradient-to-br from-orange-500/10 to-orange-500/5 shadow-lg scale-105'
                            : 'border-border hover:border-orange-500/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            provider === 'Orange' 
                              ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                              : 'bg-muted'
                          }`}>
                            <span className="text-xl font-bold text-white">OM</span>
                          </div>
                          <span className="font-bold">{t('associate.withdraw.orangeMoney')}</span>
                          {provider === 'Orange' && <Check className="w-5 h-5 text-orange-600" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="mobileNumber" className="text-base font-semibold">{t('associate.withdraw.phoneLabel')} *</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="mobileNumber"
                        type="tel"
                        placeholder={t('associate.withdraw.phonePlaceholder')}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="pl-12 h-14 text-base"
                        required
                      />
                    </div>
                  </div>
                </motion.div>


                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary via-blue-600 to-green-600 hover:shadow-xl hover:scale-[1.02] transition-all"
                  disabled={isLoading || !amount || parseInt(amount) < minWithdrawal || parseInt(amount) > balance.available || !mobileNumber}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('associate.withdraw.processing')}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      {t('associate.withdraw.submitButton')}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Withdrawals History Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="mt-6 md:mt-8"
          >
            <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Historique des retraits</h3>
                    <p className="text-xs text-muted-foreground">Vos demandes de retrait précédentes</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="gap-2"
                >
                  {showHistory ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Afficher
                    </>
                  )}
                </Button>
              </div>

              {showHistory && (
                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : withdrawalsHistory?.withdrawals?.length > 0 ? (
                    <div className="space-y-3">
                      {withdrawalsHistory.withdrawals.map((withdrawal: any, index: number) => (
                        <motion.div
                          key={withdrawal.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all border border-border/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{withdrawal.amount.toLocaleString()} FCFA</p>
                            <p className="text-sm text-muted-foreground">
                              {withdrawal.paymentMethod === 'mobile_money' 
                                ? `Mobile Money - Frais: ${withdrawal.fee || 0} FCFA`
                                : withdrawal.paymentMethod
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Net: {withdrawal.netAmount?.toLocaleString() || (withdrawal.amount - (withdrawal.fee || 0)).toLocaleString()} FCFA
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              withdrawal.status === 'completed' ? 'text-green-600' :
                              withdrawal.status === 'pending' ? 'text-orange-600' :
                              withdrawal.status === 'rejected' ? 'text-red-600' :
                              'text-muted-foreground'
                            }`}>
                              {withdrawal.status === 'completed' ? 'Complété' :
                               withdrawal.status === 'pending' ? 'En attente' :
                               withdrawal.status === 'rejected' ? 'Rejeté' :
                               withdrawal.status}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(withdrawal.requestDate || withdrawal.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium mb-2">Aucun retrait</p>
                      <p className="text-sm opacity-70">Vous n'avez pas encore effectué de demande de retrait</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
