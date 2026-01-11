import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, Building, ArrowRight, Sparkles, CheckCircle, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/i18nContext';
import { countries, getCitiesByCountry } from '@/data/countries';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si le pays change, mettre à jour les villes disponibles
    if (field === 'country') {
      const cities = getCitiesByCountry(value);
      setAvailableCities(cities);
      setFormData(prev => ({ ...prev, city: '' })); // Réinitialiser la ville
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs requis
    if (!formData.firstName || !formData.lastName || !formData.company || !formData.email || !formData.phone || !formData.country || !formData.city) {
      toast({
        title: t('home.partner.signup.missingFields'),
        description: t('home.partner.signup.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer le nom complet du pays
      const selectedCountry = countries.find(c => c.code === formData.country);
      const countryName = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : formData.country;

      // Créer le corps de l'email avec toutes les informations
      const emailSubject = `🆕 Nouvelle demande d'accès partenaire - ${formData.company}`;
      const emailBody = `
Nouvelle demande d'accès à l'espace partenaire Studyia Career

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    INFORMATIONS DU DEMANDEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 IDENTITÉ
   Prénom          : ${formData.firstName}
   Nom             : ${formData.lastName}

🏢 ENTREPRISE
   Nom             : ${formData.company}

📧 CONTACT
   Email           : ${formData.email}
   Téléphone       : ${formData.phone}

📍 LOCALISATION
   Pays            : ${countryName}
   Ville           : ${formData.city}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date de la demande : ${new Date().toLocaleString('fr-FR', {
  dateStyle: 'full',
  timeStyle: 'long'
})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ACTIONS À EFFECTUER :

1. Vérifier la légitimité de l'entreprise
2. Créer le compte partenaire dans le système
3. Générer un mot de passe sécurisé
4. Envoyer les identifiants par email à : ${formData.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email automatique - Studyia Career Partner System
https://studyia-career.vercel.app
      `.trim();

      // Créer le lien mailto
      const mailtoLink = `mailto:contact@studyia.net?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Ouvrir le client email
      window.location.href = mailtoLink;

      // Afficher un message de confirmation
      toast({
        title: t('home.partner.signup.requestSent'),
        description: t('home.partner.signup.requestSentDesc'),
        duration: 5000,
      });

      // Rediriger vers une page de confirmation après un court délai
      setTimeout(() => {
        navigate('/partner/request-sent', { 
          state: { 
            email: formData.email,
            company: formData.company 
          } 
        });
      }, 2000);

    } catch (error) {
      toast({
        title: t('home.partner.login.error'),
        description: t('home.partner.login.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-[#0a1628] to-navy-deep relative overflow-hidden flex items-center justify-center py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-bright/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center shadow-lg shadow-primary/50 group-hover:shadow-primary/70 transition-shadow">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">Studyia Career</span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              {t('home.partner.info.heroTitle')}
              <br />
              <span className="text-gradient">{t('home.partner.info.heroTitleHighlight')}</span>
            </h1>

            <p className="text-lg text-primary-foreground/70 mb-8">
              {t('home.partner.info.heroSubtitle')}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t('home.partner.info.feature1Desc')}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t('home.partner.info.feature4Desc')}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t('home.partner.info.feature2Desc')}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t('home.partner.info.feature6Desc')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Signup form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">{t('home.partner.signup.title')}</h2>
                <p className="text-muted-foreground">{t('home.partner.signup.subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground font-medium">
                    {t('home.partner.signup.lastName')} *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t('home.partner.signup.lastNamePlaceholder')}
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">
                    {t('home.partner.signup.firstName')} *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t('home.partner.signup.firstNamePlaceholder')}
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground font-medium">
                    {t('home.partner.signup.company')} *
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="company"
                      type="text"
                      placeholder={t('home.partner.signup.companyPlaceholder')}
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    {t('home.partner.signup.email')} *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('home.partner.signup.emailPlaceholder')}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    {t('home.partner.signup.phone')} *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('home.partner.signup.phonePlaceholder')}
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-foreground font-medium">
                    {t('home.partner.signup.country')} *
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select value={formData.country} onValueChange={(value) => handleChange('country', value)} required>
                      <SelectTrigger className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors">
                        <SelectValue placeholder={t('home.partner.signup.countryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground font-medium">
                    {t('home.partner.signup.city')} *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => handleChange('city', value)} 
                      disabled={!formData.country}
                      required
                    >
                      <SelectTrigger className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors">
                        <SelectValue placeholder={formData.country ? t('home.partner.signup.cityPlaceholder') : t('home.partner.signup.cityPlaceholderDisabled')} />
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

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('home.partner.signup.submit')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {t('home.partner.signup.alreadyPartner')}{' '}
                  <Link
                    to="/partner/login"
                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                  >
                    {t('home.partner.signup.loginHere')}
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
                  ← {t('home.partner.signup.backHome')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
