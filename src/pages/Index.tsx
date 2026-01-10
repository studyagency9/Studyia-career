import { CheckCircle, FileText, Download, Eye, Users, Zap, Shield, Star, ArrowRight, ChevronRight, Menu, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageSwitcherDemo } from "@/components/LanguageSwitcherDemo";
import { useTranslation } from "@/i18n/i18nContext";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Hero Section
const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-bright/20 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary-foreground/80">{t('home.hero.badge')}</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            {t('home.hero.title')}
            <br />
            <span className="text-gradient">{t('home.hero.titleHighlight')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10"
          >
            {t('home.hero.subtitle')}
            <br className="hidden md:block" />
            {t('home.hero.subtitle2')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/builder">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                {t('home.hero.ctaSecondary')}
                <Upload className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-primary-foreground/60"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm">{t('home.hero.trustFree')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">{t('home.hero.trustSecure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">{t('home.hero.trustFast')}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CV Preview mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 md:mt-24 max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl" />
            
            {/* CV Preview Card */}
            <div className="relative bg-background rounded-2xl shadow-2xl overflow-hidden border border-border/20">
              <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
                <span className="ml-4 text-sm text-muted-foreground">{t('home.cvPreview.realTimePreview')}</span>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side - CV Preview */}
                  <div className="flex-1 bg-background border border-border rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center text-primary-foreground text-2xl font-bold">
                          JD
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground">Jean Dupont</h3>
                          <p className="text-primary font-medium">Développeur Full-Stack</p>
                          <p className="text-sm text-muted-foreground mt-1">Douala, Cameroun</p>
                        </div>
                      </div>
                      
                      <div className="h-px bg-border" />
                      
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">EXPÉRIENCE</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground">Développeur Web - TechCo</span>
                            <span className="text-xs text-muted-foreground">2021 - 2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground">Stagiaire IT - StartupHub</span>
                            <span className="text-xs text-muted-foreground">2020 - 2021</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">COMPÉTENCES</h4>
                        <div className="flex flex-wrap gap-2">
                          {["React", "Node.js", "Python", "SQL"].map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Controls preview */}
                  <div className="w-full md:w-64 space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-3">{t('home.cvPreview.progression')}</h4>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                      </div>
                      <p className="text-xs text-muted-foreground">75% {t('home.cvPreview.completed')}</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-3">{t('home.cvPreview.currentModel')}</h4>
                      <div className="aspect-[3/4] bg-background rounded border border-border flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Why Studyia Career Section
const WhyStudyiaCareerSection = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: t('home.why.feature1Title'),
      description: t('home.why.feature1Desc')
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('home.why.feature2Title'),
      description: t('home.why.feature2Desc')
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: t('home.why.feature3Title'),
      description: t('home.why.feature3Desc')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('home.why.feature4Title'),
      description: t('home.why.feature4Desc')
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: t('home.why.feature5Title'),
      description: t('home.why.feature5Desc')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('home.why.feature6Title'),
      description: t('home.why.feature6Desc')
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-glow" />
      
      <div className="container relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t('home.why.title')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('home.why.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: "01",
      title: t('home.howItWorks.step1Title'),
      description: t('home.howItWorks.step1Desc')
    },
    {
      number: "02",
      title: t('home.howItWorks.step2Title'),
      description: t('home.howItWorks.step2Desc')
    },
    {
      number: "03",
      title: t('home.howItWorks.step3Title'),
      description: t('home.howItWorks.step3Desc')
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t('home.howItWorks.title')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {t('home.howItWorks.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-8" />
              )}
              <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors h-full transform hover:-translate-y-2 duration-300">
                <div className="text-6xl font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">{step.number}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/builder">
            <Button variant="default" size="lg">
              {t('home.hero.ctaPrimary')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      name: "Marie Nguema",
      role: "Assistante Administrative",
      location: "Libreville, Gabon",
      content: t('home.testimonials.testimonial1'),
      avatar: "MN"
    },
    {
      name: "Paul Ekotto",
      role: "Développeur Junior",
      location: "Douala, Cameroun",
      content: t('home.testimonials.testimonial2'),
      avatar: "PE"
    },
    {
      name: "Aminata Diallo",
      role: "Commerciale",
      location: "Malabo, Guinée Éq.",
      content: t('home.testimonials.testimonial3'),
      avatar: "AD"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span 
            variants={fadeInUp}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            {t('home.testimonials.badge')}
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t('home.testimonials.title')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {t('home.testimonials.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-card rounded-2xl p-6 border border-border transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-primary/20"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-foreground mb-6 relative">
                <span className="absolute -top-3 -left-3 text-6xl text-primary/10 font-serif">“</span>
                {testimonial.content}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center text-primary-foreground text-sm font-medium border-2 border-navy-deep">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-navy-deep py-12 border-t border-primary-foreground/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">Studyia Career</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm max-w-xs">
              {t('home.footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">{t('home.footer.product')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">{t('home.footer.features')}</a></li>
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">{t('home.footer.templates')}</a></li>
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">{t('home.footer.pricing')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">{t('home.footer.legal')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">{t('home.footer.terms')}</a></li>
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">{t('home.footer.privacy')}</a></li>
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">{t('home.footer.contact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">{t('home.footer.partners')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/partner-info" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform"></span>
                  {t('home.footer.becomePartner')}
                </Link>
              </li>
              <li>
                <Link to="/partner/login" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-blue-bright group-hover:scale-125 transition-transform"></span>
                  {t('home.footer.partnerLogin')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 text-sm">
            &copy; 2024 Studyia Career. {t('home.footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/40 text-sm"> 🇨🇲 🇬🇦 🇬🇶</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Partner Promotion Section
const PartnerPromotionSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-blue-bright/5 to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-bright/10 rounded-full blur-3xl"
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

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t('home.partner.promo.badge')}</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t('home.partner.promo.title')}
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                {t('home.partner.promo.subtitle')}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('home.partner.promo.feature1Title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.partner.promo.feature1Desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('home.partner.promo.feature2Title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.partner.promo.feature2Desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('home.partner.promo.feature3Title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.partner.promo.feature3Desc')}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/partner-info">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all gap-2 w-full sm:w-auto">
                    {t('home.partner.promo.learnMore')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/partner/signup">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    {t('home.partner.promo.requestAccess')}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-background to-muted border border-border rounded-2xl p-8 shadow-2xl">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{t('home.partner.promo.dashboard')}</h4>
                        <p className="text-sm text-muted-foreground">{t('home.partner.promo.dashboardSubtitle')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                      <FileText className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">247</p>
                      <p className="text-xs text-muted-foreground">{t('home.partner.promo.cvsCreated')}</p>
                    </div>
                    <div className="bg-blue-bright/5 rounded-xl p-4 border border-blue-bright/10">
                      <Download className="w-8 h-8 text-blue-bright mb-2" />
                      <p className="text-2xl font-bold text-foreground">189</p>
                      <p className="text-xs text-muted-foreground">{t('home.partner.promo.downloads')}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-foreground flex-1">CV Marketing - Jean Dupont</span>
                      <span className="text-xs text-muted-foreground">{t('home.partner.promo.today')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm text-foreground flex-1">CV Commercial - Marie Kane</span>
                      <span className="text-xs text-muted-foreground">{t('home.partner.promo.yesterday')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm text-foreground flex-1">CV IT - Paul Mbarga</span>
                      <span className="text-xs text-muted-foreground">{t('home.partner.promo.daysAgo')} 2 {t('home.partner.promo.daysAgoSuffix')}</span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-primary to-blue-bright text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {t('home.partner.promo.premium')}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main Index Page
const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <section id="features">
          <WhyStudyiaCareerSection />
        </section>
        <HowItWorksSection />
        <section id="templates">
          <TemplatesSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <PartnerPromotionSection />
        <PartnersSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

// Templates Section
const TemplatesSection = () => {
  const { t } = useTranslation();
  
  const templates = [
    { id: "professional", name: t('home.templates.professional'), category: "Tous métiers", color: "from-primary to-blue-bright", description: t('home.templates.professionalDesc') },
    { id: "creative", name: t('home.templates.creative'), category: "Design & Marketing", color: "from-purple-500 to-pink-500", description: t('home.templates.creativeDesc') },
    { id: "minimal", name: t('home.templates.minimal'), category: "Administration", color: "from-slate-600 to-slate-800", description: t('home.templates.minimalDesc') },
    { id: "executive", name: t('home.templates.executive'), category: "Direction", color: "from-slate-700 to-amber-600", description: t('home.templates.executiveDesc') },
    { id: "fresh", name: t('home.templates.fresh'), category: "Étudiant", color: "from-emerald-500 to-teal-500", description: t('home.templates.freshDesc') },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span 
            variants={fadeInUp}
            className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4"
          >
            {t('home.templates.badge')}
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t('home.templates.title')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {t('home.templates.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {templates.map((template, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <Link to="/builder" className="group block">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                  {/* Template preview */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="absolute inset-3 bg-background rounded-lg shadow-lg p-3">
                    {/* Mini CV preview */}
                    <div className={`h-8 rounded bg-gradient-to-r ${template.color} mb-2`} />
                    <div className="space-y-1.5">
                      <div className="h-2 bg-foreground/20 rounded w-3/4" />
                      <div className="h-2 bg-foreground/10 rounded w-1/2" />
                      <div className="h-2 bg-foreground/10 rounded w-5/6" />
                      <div className="h-2 bg-foreground/10 rounded w-2/3" />
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="h-2 bg-foreground/10 rounded w-full" />
                      <div className="h-2 bg-foreground/10 rounded w-4/5" />
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-primary-foreground font-semibold text-sm flex items-center gap-2">
                      {t('home.templates.useTemplate')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/builder">
            <Button variant="default" size="lg">
              {t('home.templates.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Partners Section
const PartnersSection = () => {
  const { t } = useTranslation();
  
  const partners = [
    "Orange Money", "MTN Mobile Money", "Express Union", "UBA", "Afriland First Bank", "BICEC"
  ];

  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{t('home.partners.title')}</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {partners.map((partner, index) => (
            <div key={index} className="text-muted-foreground/60 hover:text-foreground transition-colors font-semibold text-lg">
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 md:py-32 bg-hero-gradient relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {t('home.finalCta.title')}
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-10">
            {t('home.finalCta.subtitle')}
          </p>
          <Link to="/builder">
            <Button variant="hero" size="xl">
              {t('home.finalCta.cta')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {["JD", "MN", "PE", "AD"].map((initials, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center text-primary-foreground text-sm font-medium border-2 border-navy-deep">
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-primary-foreground/70 text-sm">{t('home.finalCta.badge')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Header Component
const Header = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/80 backdrop-blur-xl border-b border-primary-foreground/10">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">Studyia Career</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
              {t('nav.features')}
            </a>
            <a href="#templates" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
              {t('nav.templates')}
            </a>
            <a href="#testimonials" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
              {t('nav.testimonials')}
            </a>
            <LanguageSwitcherDemo />
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link to="/builder">
              <Button variant="hero" size="default">
                {t('nav.builder')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-deep border-t border-primary-foreground/10"
          >
            <nav className="container py-4 flex flex-col gap-4">
              <a href="#features" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors py-2">
                {t('nav.features')}
              </a>
              <a href="#templates" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors py-2">
                {t('nav.templates')}
              </a>
              <a href="#testimonials" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors py-2">
                {t('nav.testimonials')}
              </a>
              <div className="py-2">
                <LanguageSwitcherDemo />
              </div>
              <Link to="/builder">
                <Button variant="hero" size="default" className="w-full">
                  {t('nav.builder')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Index;
