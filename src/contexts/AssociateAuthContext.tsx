import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Associate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  referralCode: string;
  referralLink: string;
  totalSales: number;
  totalCommission: number;
  availableBalance: number;
  withdrawnAmount: number;
  status: 'active' | 'suspended' | 'banned';
  isVerified: boolean;
  createdAt: string;
}

export interface Sale {
  id: string;
  customerName?: string;
  customerEmail?: string;
  cvType: 'public' | 'partner';
  commissionAmount: number;
  status: 'pending' | 'validated' | 'cancelled';
  createdAt: string;
  validatedAt?: string;
}

export interface AssociateStats {
  today: {
    sales: number;
    commission: number;
  };
  thisWeek: {
    sales: number;
    commission: number;
  };
  thisMonth: {
    sales: number;
    commission: number;
  };
  allTime: {
    sales: number;
    commission: number;
  };
}

interface AssociateAuthContextType {
  associate: Associate | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  sales: Sale[];
  stats: AssociateStats;
  balance: {
    available: number;
    pending: number;
    withdrawn: number;
    total: number;
  };
  refreshStats: () => void;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const AssociateAuthContext = createContext<AssociateAuthContextType | undefined>(undefined);

export const AssociateAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const storedAssociate = localStorage.getItem('studyia_associate');
    if (storedAssociate) {
      setAssociate(JSON.parse(storedAssociate));
      
      const allSales = localStorage.getItem('studyia_associate_sales');
      if (allSales) {
        const parsedSales = JSON.parse(allSales);
        setSales(parsedSales.filter((sale: Sale) => sale.id === JSON.parse(storedAssociate).id));
      }
    }
  }, []);

  const generateReferralCode = (firstName: string): string => {
    const prefix = firstName.substring(0, 4).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${year}${random}`;
  };

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    const associates = JSON.parse(localStorage.getItem('studyia_associates') || '[]');
    
    if (associates.some((a: any) => a.email === data.email)) {
      return false;
    }

    const referralCode = generateReferralCode(data.firstName);
    const referralLink = `${window.location.origin}?ref=${referralCode}`;

    const newAssociate: Associate & { password: string } = {
      id: Date.now().toString(),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      referralCode,
      referralLink,
      totalSales: 0,
      totalCommission: 0,
      availableBalance: 0,
      withdrawnAmount: 0,
      status: 'active',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    associates.push(newAssociate);
    localStorage.setItem('studyia_associates', JSON.stringify(associates));

    const { password: _, ...associateWithoutPassword } = newAssociate;
    setAssociate(associateWithoutPassword);
    localStorage.setItem('studyia_associate', JSON.stringify(associateWithoutPassword));
    setSales([]);

    return true;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const associates = JSON.parse(localStorage.getItem('studyia_associates') || '[]');
    const foundAssociate = associates.find((a: any) => a.email === email && a.password === password);
    
    if (foundAssociate) {
      const { password: _, ...associateWithoutPassword } = foundAssociate;
      setAssociate(associateWithoutPassword);
      localStorage.setItem('studyia_associate', JSON.stringify(associateWithoutPassword));
      
      const allSales = localStorage.getItem('studyia_associate_sales');
      if (allSales) {
        const parsedSales = JSON.parse(allSales);
        setSales(parsedSales.filter((sale: Sale) => sale.id === foundAssociate.id));
      }
      
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAssociate(null);
    setSales([]);
    localStorage.removeItem('studyia_associate');
  }, []);

  const calculateStats = useCallback((): AssociateStats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: AssociateStats = {
      today: { sales: 0, commission: 0 },
      thisWeek: { sales: 0, commission: 0 },
      thisMonth: { sales: 0, commission: 0 },
      allTime: { sales: 0, commission: 0 },
    };

    sales.forEach(sale => {
      if (sale.status !== 'validated') return;
      
      const saleDate = new Date(sale.createdAt);
      
      stats.allTime.sales++;
      stats.allTime.commission += sale.commissionAmount;
      
      if (saleDate >= today) {
        stats.today.sales++;
        stats.today.commission += sale.commissionAmount;
      }
      
      if (saleDate >= weekAgo) {
        stats.thisWeek.sales++;
        stats.thisWeek.commission += sale.commissionAmount;
      }
      
      if (saleDate >= monthStart) {
        stats.thisMonth.sales++;
        stats.thisMonth.commission += sale.commissionAmount;
      }
    });

    return stats;
  }, [sales]);

  const balance = {
    available: associate?.availableBalance || 0,
    pending: sales.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.commissionAmount, 0),
    withdrawn: associate?.withdrawnAmount || 0,
    total: associate?.totalCommission || 0,
  };

  const stats = calculateStats();

  const refreshStats = useCallback(() => {
    if (!associate) return;
    
    const allSales = localStorage.getItem('studyia_associate_sales');
    if (allSales) {
      const parsedSales = JSON.parse(allSales);
      setSales(parsedSales.filter((sale: Sale) => sale.id === associate.id));
    }
  }, [associate]);

  return (
    <AssociateAuthContext.Provider
      value={{
        associate,
        isAuthenticated: !!associate,
        login,
        signup,
        logout,
        sales,
        stats,
        balance,
        refreshStats,
      }}
    >
      {children}
    </AssociateAuthContext.Provider>
  );
};

export const useAssociateAuth = () => {
  const context = useContext(AssociateAuthContext);
  if (!context) {
    throw new Error('useAssociateAuth must be used within AssociateAuthProvider');
  }
  return context;
};
