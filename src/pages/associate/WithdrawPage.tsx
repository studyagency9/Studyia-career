import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Smartphone, AlertCircle, ArrowLeft, Sparkles, Wallet, Check, Info, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { Link } from 'react-router-dom';

const WithdrawPage = () => {
  const { balance } = useAssociateAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'mobile_money'>('mobile_money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'Orange'>('MTN');

  const minWithdrawal = 5000;
  const fees = {
    mobile_money: Math.max(500, (parseInt(amount) || 0) * 0.02),
  };

  const netAmount = (parseInt(amount) || 0) - fees[method];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseInt(amount);

    if (withdrawAmount < minWithdrawal) {
      toast({
        title: 'Montant insuffisant',
        description: `Le montant minimum de retrait est de ${minWithdrawal.toLocaleString()} FCFA`,
        variant: 'destructive',
      });
      return;
    }

    if (withdrawAmount > balance.available) {
      toast({
        title: 'Solde insuffisant',
        description: 'Vous ne pouvez pas retirer plus que votre solde disponible',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Demande envoyée',
      description: 'Votre demande de retrait sera traitée sous 24-48h',
    });

    setAmount('');
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
              Retour au Dashboard
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
              Retrait de gains
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              Retirer mes gains
            </span>
          </h1>
          <p className="text-muted-foreground">
            Demandez un retrait de vos commissions en toute sécurité
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
                  <p className="text-white/80 text-sm font-medium">Solde disponible</p>
                </div>
                <p className="text-5xl md:text-6xl font-bold mb-2">
                  {balance.available.toLocaleString()}
                </p>
                <p className="text-white/80 text-lg">FCFA</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-green-600">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">Informations</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Minimum :</strong> {minWithdrawal.toLocaleString()} FCFA</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Délai :</strong> 24-48h</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Frais :</strong> 2% (min 500 FCFA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Méthodes :</strong> MTN Money, Orange Money</span>
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
                  <h2 className="text-2xl font-bold">Demande de retrait</h2>
                  <p className="text-sm text-muted-foreground">Remplissez le formulaire ci-dessous</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-base font-semibold">Montant à retirer *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="10000"
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
                        <span className="text-muted-foreground">Montant demandé</span>
                        <span className="font-semibold">{parseInt(amount).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Frais de traitement</span>
                        <span className="font-semibold text-orange-600">-{fees[method].toLocaleString()} FCFA</span>
                      </div>
                      <div className="pt-2 border-t border-green-500/20">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-600">Vous recevrez</span>
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
                      <p className="font-semibold mb-1">Mobile Money uniquement</p>
                      <p className="text-sm text-muted-foreground">Retraits via MTN Money ou Orange Money avec frais de 2% (minimum 500 FCFA)</p>
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
                    <Label className="text-base font-semibold">Opérateur Mobile Money *</Label>
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
                          <span className="font-bold">MTN Money</span>
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
                          <span className="font-bold">Orange Money</span>
                          {provider === 'Orange' && <Check className="w-5 h-5 text-orange-600" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="mobileNumber" className="text-base font-semibold">Numéro Mobile Money *</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="mobileNumber"
                        type="tel"
                        placeholder="+237 6XX XXX XXX"
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
                  disabled={!amount || parseInt(amount) < minWithdrawal || parseInt(amount) > balance.available}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Demander le retrait
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
