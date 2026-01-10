import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Globe, 
  Download, 
  History, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n/i18nContext';

const PartnerInfoPage = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: FileText,
      title: t('home.partner.info.feature1Title'),
      description: t('home.partner.info.feature1Desc'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Globe,
      title: t('home.partner.info.feature2Title'),
      description: t('home.partner.info.feature2Desc'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Download,
      title: t('home.partner.info.feature3Title'),
      description: t('home.partner.info.feature3Desc'),
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: History,
      title: t('home.partner.info.feature4Title'),
      description: t('home.partner.info.feature4Desc'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: t('home.partner.info.feature5Title'),
      description: t('home.partner.info.feature5Desc'),
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Zap,
      title: t('home.partner.info.feature6Title'),
      description: t('home.partner.info.feature6Desc'),
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('home.partner.info.step1Title'),
      description: t('home.partner.info.step1Desc'),
      icon: Mail,
    },
    {
      number: '02',
      title: t('home.partner.info.step2Title'),
      description: t('home.partner.info.step2Desc'),
      icon: Clock,
    },
    {
      number: '03',
      title: t('home.partner.info.step3Title'),
      description: t('home.partner.info.step3Desc'),
      icon: CheckCircle,
    },
    {
      number: '04',
      title: t('home.partner.info.step4Title'),
      description: t('home.partner.info.step4Desc'),
      icon: Sparkles,
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t('home.partner.info.benefit1Title'),
      description: t('home.partner.info.benefit1Desc'),
    },
    {
      icon: Users,
      title: t('home.partner.info.benefit2Title'),
      description: t('home.partner.info.benefit2Desc'),
    },
    {
      icon: Award,
      title: t('home.partner.info.benefit3Title'),
      description: t('home.partner.info.benefit3Desc'),
    },
  ];

  const requirements = [
    t('home.partner.info.requirement1'),
    t('home.partner.info.requirement2'),
    t('home.partner.info.requirement3'),
    t('home.partner.info.requirement4'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-[#0a1628] to-navy-deep">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center shadow-lg shadow-primary/50 group-hover:shadow-primary/70 transition-shadow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Studyia Career</span>
            </Link>
            <Link to="/partner/login">
              <Button variant="outline" className="gap-2">
                {t('home.partner.info.login')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated background */}
        <div className="absolute inset-0">
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

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('home.partner.info.badge')}</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('home.partner.info.heroTitle')}
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-bright to-primary bg-clip-text text-transparent">
                {t('home.partner.info.heroTitleHighlight')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {t('home.partner.info.heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all gap-2 text-base px-8">
                  {t('home.partner.info.requestAccess')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/partner/login">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  <Users className="w-5 h-5" />
                  {t('home.partner.info.alreadyPartner')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.partner.info.featuresTitle')}
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t('home.partner.info.featuresSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-card-foreground/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.partner.info.benefitsTitle')}
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              {t('home.partner.info.benefitsSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-white/90">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.partner.info.howItWorksTitle')}
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t('home.partner.info.howItWorksSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <Card className="p-6 bg-card backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 relative z-10 h-full">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{step.title}</h3>
                  <p className="text-card-foreground/70">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.partner.info.requirementsTitle')}
              </h2>
              <p className="text-white/90 text-lg">
                {t('home.partner.info.requirementsSubtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 bg-card backdrop-blur-sm border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      {t('home.partner.info.prerequisitesTitle')}
                    </h3>
                    <ul className="space-y-3">
                      {requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-card-foreground">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {t('home.partner.info.coverageTitle')}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-card-foreground">
                        <span className="text-2xl">🇨🇲</span>
                        <span>{t('home.partner.info.cameroon')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-card-foreground">
                        <span className="text-2xl">🇬🇦</span>
                        <span>{t('home.partner.info.gabon')}</span>
                      </li>
                      <li className="flex items-center gap-2 text-card-foreground">
                        <span className="text-2xl">🇬🇶</span>
                        <span>{t('home.partner.info.equatorialGuinea')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">{t('home.partner.info.manualValidationTitle')}</h4>
                      <p className="text-sm text-card-foreground/80">
                        {t('home.partner.info.manualValidationDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-bright/20 to-primary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Card className="p-12 bg-background/95 backdrop-blur-xl border-border shadow-2xl">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('home.partner.info.ctaTitle')}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {t('home.partner.info.ctaSubtitle')}
              </p>
              <Link to="/partner/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all gap-2 text-base px-8">
                  {t('home.partner.info.ctaButton')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-6">
                {t('home.partner.info.alreadyPartner')}{' '}
                <Link to="/partner/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  {t('home.partner.info.ctaLogin')}
                </Link>
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center shadow-lg shadow-primary/50">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                {t('home.partner.info.footerCopyright')}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('home.partner.info.footerHome')}
              </Link>
              <a href="mailto:contact@studyia.net" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('home.partner.info.footerContact')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PartnerInfoPage;
