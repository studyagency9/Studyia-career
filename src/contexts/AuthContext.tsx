import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { Plan, PlanType, PLANS } from '@/data/plans';

export interface Partner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  plan: PlanType;
  cvUsedThisMonth: number;
  planRenewalDate: string;
  status: 'active' | 'suspended';
  cvHistory: any[]; // Peut être typé plus précisément plus tard
  createdAt: string;
  updatedAt: string;
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

  // Au chargement, vérifier si un token partenaire existe et est valide
  useEffect(() => {
    const verifyPartnerToken = async () => {
      const token = localStorage.getItem('partner_accessToken');
      const localPartner = localStorage.getItem('partner');
      if (token && localPartner) {
        const partnerData = JSON.parse(localPartner);
        setPartner(partnerData);
        setSavedCVs(partnerData.cvHistory || []);
      }
    };
    verifyPartnerToken();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { partner, accessToken, refreshToken } = response.data.data;
        
        localStorage.setItem('partner_accessToken', accessToken);
        localStorage.setItem('partner_refreshToken', refreshToken);
        localStorage.setItem('partner', JSON.stringify(partner));
        
        setPartner(partner);
        setSavedCVs(partner.cvHistory || []);

        return true;
      }
    } catch (error) {
      console.error('Erreur de connexion partenaire:', error);
    }
    return false;
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    // La création de partenaire se fait côté admin, cette fonction ne fait rien.
    console.warn('La fonction signup pour partenaire n\'est pas implémentée côté client.');
    return false;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('partner_refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion du partenaire:', error);
    } finally {
      setPartner(null);
      setSavedCVs([]);
      localStorage.removeItem('partner_accessToken');
      localStorage.removeItem('partner_refreshToken');
      localStorage.removeItem('partner');
    }
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
