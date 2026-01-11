import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { getWebPageSchema } from '@/utils/seo';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, TrendingUp, Sparkles, ArrowRight, Eye, EyeOff, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const AssociateLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAssociateAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useSEO({
    title: 'Connexion Associé - Studyia Career | Espace Commercial',
    description: 'Connectez-vous à votre espace associé commercial Studyia Career. Suivez vos ventes, vos commissions et gérez vos retraits.',
    keywords: 'connexion associé, login commercial, espace associé Studyia, commercial CV',
    canonical: 'https://career.studyia.net/associate/login',
    structuredData: getWebPageSchema({
      name: 'Connexion Associé',
      description: 'Page de connexion pour les associés commerciaux',
      url: 'https://career.studyia.net/associate/login'
    })
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      toast({
        title: t('associate.login.success'),
        description: t('associate.login.successDesc'),
      });
      navigate('/associate/dashboard');
    } else {
      toast({
        title: t('associate.login.error'),
        description: t('associate.login.errorDesc'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-green-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher variant="light" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {t('associate.login.badge')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              {t('associate.login.title')}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {t('associate.login.subtitle')}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-6 md:p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-green-600 mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{t('associate.login.formTitle')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('associate.login.formSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">{t('associate.login.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('associate.login.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-blue-600 to-green-600 hover:shadow-lg hover:scale-[1.02] transition-all"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {t('associate.login.connecting')}
                </>
              ) : (
                <>
                  {t('associate.login.connect')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <p className="relative text-center text-sm text-muted-foreground bg-card px-4 -mt-2">
              {t('associate.login.notMember')}{' '}
              <Link to="/associate/signup" className="font-semibold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent hover:underline">
                {t('associate.login.createAccount')}
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← {t('associate.common.backToHome')}
            </Link>
          </div>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-green-500/10 to-blue-600/10 border border-primary/20 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-green-600">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">{t('associate.login.tipTitle')}</p>
              <p className="text-xs text-muted-foreground">
                {t('associate.login.tipDesc')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">500</div>
            <div className="text-xs text-muted-foreground mt-1">{t('associate.signup.perCV')}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">6K</div>
            <div className="text-xs text-muted-foreground mt-1">{t('associate.signup.perPro')}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">12K</div>
            <div className="text-xs text-muted-foreground mt-1">{t('associate.signup.perBusiness')}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssociateLoginPage;
