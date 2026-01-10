import { motion } from 'framer-motion';
import { Check, Sparkles, TrendingUp, Zap, Crown, ArrowRight } from 'lucide-react';
import { useAuth, PLANS, PlanType } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PartnerLayout from '@/components/partner/PartnerLayout';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/i18nContext';

const PricingPage = () => {
  const { partner, currentPlan, changePlan } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectPlan = (planType: PlanType) => {
    if (partner?.plan === planType) {
      toast({
        title: t('home.partner.pricing.alreadyOnPlan'),
        description: t('home.partner.pricing.alreadyOnPlanDesc'),
      });
      return;
    }

    const plan = PLANS[planType];
    const isUpgrade = partner?.plan === 'starter' && (planType === 'pro' || planType === 'business') ||
                      partner?.plan === 'pro' && planType === 'business';
    const action = isUpgrade ? 'changement' : 'renouvellement';

    // Créer le contenu de l'email
    const emailSubject = `Demande de ${action} de forfait - ${partner?.company}`;
    const emailBody = `Bonjour,

Je souhaite effectuer un ${action} de forfait pour mon compte partenaire Studyia.

INFORMATIONS DU PARTENAIRE :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom complet : ${partner?.firstName} ${partner?.lastName}
Entreprise : ${partner?.company}
Email : ${partner?.email}
Forfait actuel : ${currentPlan?.name} (${currentPlan?.monthlyQuota} CV/mois)

DEMANDE :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nouveau forfait souhaité : ${plan.name}
Quota mensuel : ${plan.monthlyQuota} CV/mois
Prix : ${plan.price.toLocaleString('fr-FR')} FCFA/mois

Merci de traiter cette demande dans les plus brefs délais.

Cordialement,
${partner?.firstName} ${partner?.lastName}`;

    // Ouvrir le client email
    window.location.href = `mailto:contact@studyia.net?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    toast({
      title: t('home.partner.pricing.emailPrepared'),
      description: t('home.partner.pricing.emailPreparedDesc'),
      duration: 5000,
    });
  };

  const planOrder: PlanType[] = ['starter', 'pro', 'business'];

  const getPlanIcon = (type: PlanType) => {
    switch (type) {
      case 'starter':
        return Zap;
      case 'pro':
        return TrendingUp;
      case 'business':
        return Crown;
    }
  };

  const getPlanColor = (type: PlanType) => {
    switch (type) {
      case 'starter':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-primary to-blue-bright';
      case 'business':
        return 'from-purple-500 to-purple-600';
    }
  };

  const getPlanSubtitle = (type: PlanType) => {
    switch (type) {
      case 'starter':
        return t('home.partner.pricing.starterSubtitle');
      case 'pro':
        return t('home.partner.pricing.proSubtitle');
      case 'business':
        return t('home.partner.pricing.businessSubtitle');
    }
  };

  const getPotentialRevenue = (quota: number) => {
    return (quota * 1500).toLocaleString('fr-FR');
  };

  return (
    <PartnerLayout>
      <div className="p-8 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('home.partner.pricing.badge')}</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('home.partner.pricing.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.partner.pricing.subtitle')}
          </p>

          {currentPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20"
            >
              <Check className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                {t('home.partner.pricing.currentPlan')} : {currentPlan.name}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {planOrder.map((planType, index) => {
            const plan = PLANS[planType];
            const Icon = getPlanIcon(planType);
            const isCurrentPlan = partner?.plan === planType;
            const isRecommended = plan.recommended;

            return (
              <motion.div
                key={planType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="relative h-full flex flex-col"
              >
                {isRecommended && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-blue-bright text-primary-foreground text-sm font-semibold shadow-lg">
                      ⭐ {plan.badge}
                    </div>
                  </motion.div>
                )}

                <Card
                  className={`relative overflow-hidden flex flex-col h-full ${
                    isRecommended
                      ? 'border-2 border-primary shadow-2xl shadow-primary/20'
                      : 'border-border'
                  } ${isCurrentPlan ? 'ring-2 ring-success' : ''}`}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${getPlanColor(
                      planType
                    )} opacity-10`}
                  />

                  <div className="relative p-8 flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPlanColor(
                        planType
                      )} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Plan name & subtitle */}
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{getPlanSubtitle(planType)}</p>

                    {/* Potential revenue - Fixed height container for alignment */}
                    <div className="mb-6 min-h-[88px]">
                      {planType === 'pro' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="p-4 rounded-xl bg-success/10 border border-success/20"
                        >
                          <p className="text-xs text-success font-semibold mb-1">💼 {t('home.partner.pricing.potentialRevenue')}</p>
                          <p className="text-lg font-bold text-success">
                            {t('home.partner.pricing.upTo')} {getPotentialRevenue(plan.monthlyQuota)} {t('home.partner.pricing.perMonth')}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-muted-foreground">{t('home.partner.pricing.perMonth')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ≈ {plan.pricePerDay.toLocaleString('fr-FR')} {t('home.partner.pricing.perDay')}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                          <span className="text-sm text-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <Button
                        onClick={() => handleSelectPlan(planType)}
                        disabled={isCurrentPlan}
                        className={`w-full ${
                          isRecommended
                            ? 'bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50'
                            : ''
                        }`}
                        variant={isRecommended ? 'default' : 'outline'}
                        size="lg"
                      >
                        {isCurrentPlan ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            {t('home.partner.pricing.currentPlanButton')}
                          </>
                        ) : (
                          <>
                            {t('home.partner.pricing.requestPlan')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>

                      {isCurrentPlan && (
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          {t('home.partner.pricing.renewalOn')}{' '}
                          {new Date(partner.planRenewalDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-muted/30 border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">📋 {t('home.partner.pricing.infoTitle')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('home.partner.pricing.infoQuota')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('home.partner.pricing.infoPlanChange')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('home.partner.pricing.infoNoCommitment')}</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </PartnerLayout>
  );
};

export default PricingPage;
