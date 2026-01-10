import { motion } from 'framer-motion';
import { CheckCircle, Mail, ArrowRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n/i18nContext';

const RequestSentPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { email, company } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-[#0a1628] to-navy-deep relative overflow-hidden flex items-center justify-center">
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

      <div className="container relative z-10 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-12 bg-background/95 backdrop-blur-xl border-border shadow-2xl text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/50"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-bold text-foreground mb-4"
            >
              {t('home.partner.requestSent.title')}
            </motion.h1>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              <p className="text-lg text-muted-foreground">
                {t('home.partner.requestSent.subtitle')}
              </p>

              {email && company && (
                <div className="bg-muted/50 rounded-xl p-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Entreprise : <span className="font-medium text-foreground">{company}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8"
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                {t('home.partner.requestSent.nextStepsTitle')}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('home.partner.requestSent.step1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('home.partner.requestSent.step2')} <strong className="text-foreground">{t('home.partner.requestSent.step2Time')}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('home.partner.requestSent.step3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t('home.partner.requestSent.step4')}</span>
                </li>
              </ul>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <Button size="lg" variant="outline" className="gap-2">
                  <Home className="w-5 h-5" />
                  {t('home.partner.requestSent.backHome')}
                </Button>
              </Link>
              <Link to="/partner/login">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all gap-2">
                  {t('home.partner.requestSent.alreadyPartner')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 pt-8 border-t border-border"
            >
              <p className="text-sm text-muted-foreground">
                {t('home.partner.requestSent.contactQuestion')}{' '}
                <a 
                  href="mailto:contact@studyia.net" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  contact@studyia.net
                </a>
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestSentPage;
