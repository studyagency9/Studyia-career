export type PlanType = 'starter' | 'pro' | 'business';

export interface Plan {
  type: PlanType;
  name: string;
  monthlyQuota: number;
  price: number;
  pricePerDay: number;
  features: string[];
  badge?: string;
  recommended?: boolean;
}

export const PLANS: Record<PlanType, Plan> = {
  starter: {
    type: 'starter',
    name: 'Starter',
    monthlyQuota: 30,
    price: 15000,
    pricePerDay: 500,
    features: [
      '30 CV par mois',
      'Accès à l\'outil de création',
      'Templates standards',
      'Support basique',
    ],
  },
  pro: {
    type: 'pro',
    name: 'Pro',
    monthlyQuota: 100,
    price: 30000,
    pricePerDay: 1000,
    badge: 'Le plus rentable',
    recommended: true,
    features: [
      'Jusqu\'à 100 CV par mois',
      'Accès COMPLET à l\'outil',
      'Tous les templates premium',
      'Optimisation ATS',
      'Gestion clients (historique CV)',
      'Support prioritaire',
    ],
  },
  business: {
    type: 'business',
    name: 'Business',
    monthlyQuota: 300,
    price: 60000,
    pricePerDay: 2000,
    features: [
      '300 CV par mois',
      'Tout le forfait PRO',
      'Multi-utilisateurs',
      'Branding léger (logo partenaire)',
      'Support dédié',
    ],
  },
};
