import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { getWebPageSchema } from '@/utils/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, TrendingUp, DollarSign, Users, Sparkles, Zap, Target, ArrowRight, Check, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAssociateAuth } from '@/contexts/AssociateAuthContext';
import { useTranslation } from '@/i18n/i18nContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { centralAfricaCountries, getCitiesByCountryCode } from '@/data/centralAfricaCountries';

const AssociateSignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAssociateAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useSEO({
    title: 'Devenir Associé Commercial - Studyia Career | Gagnez des commissions',
    description: 'Rejoignez le programme d\'associés commerciaux Studyia Career. Vendez des CV professionnels, gagnez des commissions attractives et développez votre réseau. Inscription gratuite.',
    keywords: 'devenir associé, commercial Studyia, gagner commissions, vente CV, programme affiliation',
    canonical: 'https://career.studyia.net/associate/signup',
    structuredData: getWebPageSchema({
      name: 'Inscription Associé Commercial',
      description: 'Formulaire d\'inscription pour devenir associé commercial',
      url: 'https://career.studyia.net/associate/signup'
    })
  });

  const handleCountryChange = (countryCode: string) => {
    setFormData({ ...formData, country: countryCode, city: '' });
    const cities = getCitiesByCountryCode(countryCode);
    setAvailableCities(cities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('associate.signup.error'),
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    const success = await signup({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
    });

    setIsLoading(false);

    if (success) {
      toast({
        title: t('associate.signup.success'),
        description: t('associate.signup.successDesc'),
      });
      navigate('/associate/dashboard');
    } else {
      toast({
        title: t('associate.signup.error'),
        description: t('associate.signup.errorEmailExists'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-green-500/5 relative overflow-hidden">
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

      <div className="container relative z-10 mx-auto px-4 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Language Switcher - Top Right */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcher variant="light" />
          </div>

          {/* Header - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                {t('associate.signup.badge')}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
                {t('associate.signup.title')}
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('associate.signup.subtitle')}
            </p>
          </motion.div>

          {/* Benefits Cards - Mobile first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12"
          >

            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('associate.signup.benefit1Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('associate.signup.benefit1Desc')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('associate.signup.benefit2Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('associate.signup.benefit2Desc')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 via-blue-600/5 to-transparent border border-blue-600/20 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('associate.signup.benefit3Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('associate.signup.benefit3Desc')}
              </p>
            </motion.div>
          </motion.div>

          {/* Earnings Example - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 md:mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-green-600 text-white shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">{t('associate.signup.potentialTitle')}</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{t('associate.signup.potentialAmount')}</div>
            <p className="text-white/80 text-sm">{t('associate.signup.potentialDesc')}</p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">500</div>
                <div className="text-xs opacity-80">{t('associate.signup.perCV')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">6K</div>
                <div className="text-xs opacity-80">{t('associate.signup.perPro')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">12K</div>
                <div className="text-xs opacity-80">{t('associate.signup.perBusiness')}</div>
              </div>
            </div>
          </motion.div>

          {/* Form - Mobile first design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-6 md:p-8 shadow-2xl max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-green-600 mb-4 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('associate.signup.formTitle')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('associate.signup.formSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('associate.signup.firstName')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('associate.signup.lastName')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('associate.signup.email')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('associate.signup.phone')} *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+237 6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t('associate.signup.country')} *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.country} onValueChange={handleCountryChange} required>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={t('associate.signup.countryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {centralAfricaCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t('associate.signup.city')} *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                      disabled={!formData.country}
                      required
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={t('associate.signup.cityPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('associate.signup.password')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('associate.signup.confirmPassword')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
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
                    {t('associate.signup.creating')}
                  </>
                ) : (
                  <>
                    {t('associate.signup.createAccount')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <p className="relative text-center text-sm text-muted-foreground bg-card px-4 -mt-2">
                  {t('associate.signup.alreadyMember')}{' '}
                  <Link to="/associate/login" className="font-semibold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent hover:underline">
                    {t('associate.signup.login')}
                  </Link>
                </p>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>{t('associate.signup.trustFree')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>{t('associate.signup.trustFast')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>{t('associate.signup.trustSecure')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AssociateSignupPage;
