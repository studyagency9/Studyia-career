import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Partner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
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
      const partnerData = JSON.parse(storedPartner);
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
    const foundPartner = partners.find((p: any) => p.email === email && p.password === password);
    
    if (foundPartner) {
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

    // Créer le nouveau partenaire
    const newPartner: Partner & { password: string } = {
      id: Date.now().toString(),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
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

  return (
    <AuthContext.Provider
      value={{
        partner,
        isAuthenticated: !!partner,
        login,
        signup,
        logout,
        savedCVs,
        saveCV,
        updateCV,
        deleteCV,
        getCV,
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
