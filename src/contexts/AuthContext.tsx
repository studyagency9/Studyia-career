import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

export interface Partner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  plan: PlanType;
  cvUsedThisMonth: number;
  planRenewalDate: string;
  createdAt: string;
}

export interface SavedCV {
  id: string;
  partnerId: string;
  name: string;
  language: 'fr' | 'en';
  data: any;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  partner: Partner | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  savedCVs: SavedCV[];
  saveCV: (cv: Omit<SavedCV, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>) => void;
  updateCV: (id: string, data: any) => void;
  deleteCV: (id: string) => void;
  getCV: (id: string) => SavedCV | undefined;
  currentPlan: Plan | null;
  remainingQuota: number;
  quotaPercentage: number;
  canCreateCV: boolean;
  changePlan: (newPlan: PlanType) => void;
  resetMonthlyQuota: () => void;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const storedPartner = localStorage.getItem('studyia_partner');
    if (storedPartner) {
      let partnerData = JSON.parse(storedPartner);
      
      // Migration automatique : ajouter les champs manquants
      if (!partnerData.plan || !partnerData.cvUsedThisMonth || !partnerData.planRenewalDate) {
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        
        partnerData = {
          ...partnerData,
          plan: partnerData.plan || 'pro',
          cvUsedThisMonth: partnerData.cvUsedThisMonth || 0,
          planRenewalDate: partnerData.planRenewalDate || renewalDate.toISOString(),
        };
        
        // Sauvegarder la version migrée
        localStorage.setItem('studyia_partner', JSON.stringify(partnerData));
        
        // Mettre à jour aussi dans la liste des partenaires
        const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
        const partnerIndex = partners.findIndex((p: any) => p.id === partnerData.id);
        if (partnerIndex !== -1) {
          partners[partnerIndex] = { ...partners[partnerIndex], ...partnerData };
          localStorage.setItem('studyia_partners', JSON.stringify(partners));
        }
      }
      
      setPartner(partnerData);
      
      // Charger les CVs du partenaire
      const allCVs = localStorage.getItem('studyia_partner_cvs');
      if (allCVs) {
        const cvs = JSON.parse(allCVs);
        setSavedCVs(cvs.filter((cv: SavedCV) => cv.partnerId === partnerData.id));
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simuler une authentification (à remplacer par une vraie API)
    const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
    let foundPartner = partners.find((p: any) => p.email === email && p.password === password);
    
    if (foundPartner) {
      // Migration automatique : ajouter les champs manquants
      if (!foundPartner.plan || foundPartner.cvUsedThisMonth === undefined || !foundPartner.planRenewalDate) {
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        
        foundPartner = {
          ...foundPartner,
          plan: foundPartner.plan || 'pro',
          cvUsedThisMonth: foundPartner.cvUsedThisMonth || 0,
          planRenewalDate: foundPartner.planRenewalDate || renewalDate.toISOString(),
        };
        
        // Mettre à jour dans la liste des partenaires
        const partnerIndex = partners.findIndex((p: any) => p.id === foundPartner.id);
        if (partnerIndex !== -1) {
          partners[partnerIndex] = foundPartner;
          localStorage.setItem('studyia_partners', JSON.stringify(partners));
        }
      }
      
      const { password: _, ...partnerWithoutPassword } = foundPartner;
      setPartner(partnerWithoutPassword);
      localStorage.setItem('studyia_partner', JSON.stringify(partnerWithoutPassword));
      
      // Charger les CVs du partenaire
      const allCVs = localStorage.getItem('studyia_partner_cvs');
      if (allCVs) {
        const cvs = JSON.parse(allCVs);
        setSavedCVs(cvs.filter((cv: SavedCV) => cv.partnerId === foundPartner.id));
      }
      
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    // Vérifier si l'email existe déjà
    const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
    if (partners.some((p: any) => p.email === data.email)) {
      return false;
    }

    // Créer le nouveau partenaire avec forfait Pro par défaut
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    
    const newPartner: Partner & { password: string } = {
      id: Date.now().toString(),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      plan: 'pro',
      cvUsedThisMonth: 0,
      planRenewalDate: renewalDate.toISOString(),
      createdAt: new Date().toISOString(),
    };

    partners.push(newPartner);
    localStorage.setItem('studyia_partners', JSON.stringify(partners));

    // Connecter automatiquement
    const { password: _, ...partnerWithoutPassword } = newPartner;
    setPartner(partnerWithoutPassword);
    localStorage.setItem('studyia_partner', JSON.stringify(partnerWithoutPassword));
    setSavedCVs([]);

    return true;
  }, []);

  const logout = useCallback(() => {
    setPartner(null);
    setSavedCVs([]);
    localStorage.removeItem('studyia_partner');
  }, []);

  const saveCV = useCallback((cv: Omit<SavedCV, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>) => {
    if (!partner) return;

    const newCV: SavedCV = {
      ...cv,
      id: Date.now().toString(),
      partnerId: partner.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allCVs = JSON.parse(localStorage.getItem('studyia_partner_cvs') || '[]');
    allCVs.push(newCV);
    localStorage.setItem('studyia_partner_cvs', JSON.stringify(allCVs));
    
    setSavedCVs(prev => [...prev, newCV]);
  }, [partner]);

  const updateCV = useCallback((id: string, data: any) => {
    const allCVs = JSON.parse(localStorage.getItem('studyia_partner_cvs') || '[]');
    const cvIndex = allCVs.findIndex((cv: SavedCV) => cv.id === id);
    
    if (cvIndex !== -1) {
      allCVs[cvIndex] = {
        ...allCVs[cvIndex],
        data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('studyia_partner_cvs', JSON.stringify(allCVs));
      setSavedCVs(prev => prev.map(cv => cv.id === id ? allCVs[cvIndex] : cv));
    }
  }, []);

  const deleteCV = useCallback((id: string) => {
    const allCVs = JSON.parse(localStorage.getItem('studyia_partner_cvs') || '[]');
    const filteredCVs = allCVs.filter((cv: SavedCV) => cv.id !== id);
    localStorage.setItem('studyia_partner_cvs', JSON.stringify(filteredCVs));
    setSavedCVs(prev => prev.filter(cv => cv.id !== id));
  }, []);

  const getCV = useCallback((id: string): SavedCV | undefined => {
    return savedCVs.find(cv => cv.id === id);
  }, [savedCVs]);

  // Calculer le plan actuel et le quota
  const currentPlan = partner && partner.plan ? PLANS[partner.plan] : null;
  const remainingQuota = partner && currentPlan ? Math.max(0, currentPlan.monthlyQuota - partner.cvUsedThisMonth) : 0;
  const quotaPercentage = partner && currentPlan ? (partner.cvUsedThisMonth / currentPlan.monthlyQuota) * 100 : 0;
  const canCreateCV = partner && currentPlan ? remainingQuota > 0 : false;

  // Changer de forfait
  const changePlan = useCallback((newPlan: PlanType) => {
    if (!partner) return;

    const updatedPartner = {
      ...partner,
      plan: newPlan,
      cvUsedThisMonth: 0,
      planRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setPartner(updatedPartner);
    localStorage.setItem('studyia_partner', JSON.stringify(updatedPartner));

    // Mettre à jour dans la liste des partenaires
    const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
    const partnerIndex = partners.findIndex((p: any) => p.id === partner.id);
    if (partnerIndex !== -1) {
      partners[partnerIndex] = { ...partners[partnerIndex], ...updatedPartner };
      localStorage.setItem('studyia_partners', JSON.stringify(partners));
    }
  }, [partner]);

  // Réinitialiser le quota mensuel
  const resetMonthlyQuota = useCallback(() => {
    if (!partner) return;

    const updatedPartner = {
      ...partner,
      cvUsedThisMonth: 0,
      planRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setPartner(updatedPartner);
    localStorage.setItem('studyia_partner', JSON.stringify(updatedPartner));

    // Mettre à jour dans la liste des partenaires
    const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
    const partnerIndex = partners.findIndex((p: any) => p.id === partner.id);
    if (partnerIndex !== -1) {
      partners[partnerIndex] = { ...partners[partnerIndex], ...updatedPartner };
      localStorage.setItem('studyia_partners', JSON.stringify(partners));
    }
  }, [partner]);

  // Incrémenter le compteur de CV lors de la sauvegarde
  const saveCVWithQuota = useCallback((cv: Omit<SavedCV, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>) => {
    if (!partner || !canCreateCV) return;

    // Incrémenter le compteur
    const updatedPartner = {
      ...partner,
      cvUsedThisMonth: partner.cvUsedThisMonth + 1,
    };

    setPartner(updatedPartner);
    localStorage.setItem('studyia_partner', JSON.stringify(updatedPartner));

    // Mettre à jour dans la liste des partenaires
    const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
    const partnerIndex = partners.findIndex((p: any) => p.id === partner.id);
    if (partnerIndex !== -1) {
      partners[partnerIndex] = { ...partners[partnerIndex], ...updatedPartner };
      localStorage.setItem('studyia_partners', JSON.stringify(partners));
    }

    // Sauvegarder le CV
    saveCV(cv);
  }, [partner, canCreateCV, saveCV]);

  return (
    <AuthContext.Provider
      value={{
        partner,
        isAuthenticated: !!partner,
        login,
        signup,
        logout,
        savedCVs,
        saveCV: saveCVWithQuota,
        updateCV,
        deleteCV,
        getCV,
        currentPlan,
        remainingQuota,
        quotaPercentage,
        canCreateCV,
        changePlan,
        resetMonthlyQuota,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
